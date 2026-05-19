import { querySource, executeSource } from '@/lib/db/source-client';

import type { InvoiceDbSource } from '@/lib/db/types';

import {

  buildDefaultLineTemplate,

  defaultInvoiceTitle,

  fetchPlatformInvoiceGlobals,

  buildUsageMonthOptions,

} from '@/lib/platform-invoice/defaults';


import type {

  PlatformInvoiceEditorState,

  PlatformInvoiceSavePayload,

} from '@/lib/platform-invoice/types';



async function ensureInvoiceTables(source: InvoiceDbSource) {

  const invoiceTable = await querySource(source, "SHOW TABLES LIKE 'cic_platform_invoice'");

  const lineTable = await querySource(source, "SHOW TABLES LIKE 'cic_platform_invoice_line'");

  if (!invoiceTable.length || !lineTable.length) {

    throw new Error('Platform invoice tables are missing on this database.');

  }

  await ensureLineUpchargeFlatColumn(source);

}



async function ensureLineUpchargeFlatColumn(source: InvoiceDbSource) {

  const columns = await querySource(source, "SHOW COLUMNS FROM cic_platform_invoice_line LIKE 'upcharge_flat'");

  if (columns.length) {

    return;

  }

  await executeSource(

    source,

    'ALTER TABLE cic_platform_invoice_line ADD COLUMN upcharge_flat decimal(12,2) NOT NULL DEFAULT 0.00 AFTER upcharge_percent',

  );

}



async function ensureNullableUserId(source: InvoiceDbSource) {

  const columns = await querySource(source, "SHOW COLUMNS FROM cic_platform_invoice LIKE 'user_id'");

  const column = columns[0];

  if (!column) {

    return;

  }



  const allowsNull = String(column.Null ?? '').toUpperCase() === 'YES';

  if (allowsNull) {

    return;

  }



  const fkRows = await querySource(

    source,

    `SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS

     WHERE TABLE_SCHEMA = DATABASE()

       AND TABLE_NAME = 'cic_platform_invoice'

       AND CONSTRAINT_NAME = 'cic_platform_invoice_user_id_foreign'

       AND CONSTRAINT_TYPE = 'FOREIGN KEY'

     LIMIT 1`,

  );



  if (fkRows.length) {

    await executeSource(

      source,

      'ALTER TABLE cic_platform_invoice DROP FOREIGN KEY cic_platform_invoice_user_id_foreign',

    );

  }



  await executeSource(

    source,

    'ALTER TABLE cic_platform_invoice MODIFY user_id bigint(20) DEFAULT NULL',

  );



  if (fkRows.length) {

    await executeSource(

      source,

      `ALTER TABLE cic_platform_invoice

       ADD CONSTRAINT cic_platform_invoice_user_id_foreign

       FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE`,

    );

  }

}



function readUserId(value: unknown): number | null {

  if (value === null || value === undefined || value === '') {

    return null;

  }

  const id = Number(value);

  return Number.isFinite(id) && id > 0 ? id : null;

}



export async function loadNewInvoiceEditor(source: InvoiceDbSource) {

  await ensureInvoiceTables(source);

  const settings = await fetchPlatformInvoiceGlobals(source);



  return {

    settings,

    usageMonths: buildUsageMonthOptions(),

    invoice: {

      platformInvoiceId: 0,

      title: defaultInvoiceTitle(),

      notes: '',

      userId: null,

      currency: settings.stripeCurrency,

      stripeInvoiceId: '',
      stripeHostedUrl: '',
      stripeDashboardUrl: '',

      lines: buildDefaultLineTemplate(settings),

    } satisfies PlatformInvoiceEditorState,

  };

}



export async function loadInvoiceEditor(source: InvoiceDbSource, invoiceId: number) {

  await ensureInvoiceTables(source);



  const rows = await querySource(

    source,

    `SELECT id, user_id, title, notes, currency, stripe_invoice_id,
            stripe_hosted_invoice_url, stripe_dashboard_url
     FROM cic_platform_invoice WHERE id = ? LIMIT 1`,

    [invoiceId],

  );



  if (!rows.length) {

    throw new Error('Invoice not found.');

  }



  const header = rows[0];

  const lineRows = await querySource(

    source,

    `SELECT line_code, sort_order, description, base_amount, upcharge_percent, upcharge_flat, usage_month, qty

     FROM cic_platform_invoice_line

     WHERE invoice_id = ?

     ORDER BY sort_order, id`,

    [invoiceId],

  );



  const settings = await fetchPlatformInvoiceGlobals(source);



  return {

    settings,

    usageMonths: buildUsageMonthOptions(),

    invoice: {

      platformInvoiceId: Number(header.id),

      title: String(header.title ?? ''),

      notes: String(header.notes ?? ''),

      userId: readUserId(header.user_id),

      currency: String(header.currency ?? settings.stripeCurrency).toLowerCase(),

      stripeInvoiceId: String(header.stripe_invoice_id ?? ''),
      stripeHostedUrl: String(header.stripe_hosted_invoice_url ?? ''),
      stripeDashboardUrl: String(header.stripe_dashboard_url ?? ''),

      lines: lineRows.map((row) => ({

        lineCode: String(row.line_code ?? 'custom'),

        sortOrder: Number(row.sort_order ?? 0),

        description: String(row.description ?? ''),

        baseAmount: Number(row.base_amount ?? 0),

        upchargePercent: Number(row.upcharge_percent ?? 0),

        upchargeFlat: Number(row.upcharge_flat ?? 0),

        usageMonth: row.usage_month ? String(row.usage_month) : null,

        qty: Number(row.qty ?? 1),

      })),

    } satisfies PlatformInvoiceEditorState,

  };

}



async function persistLines(

  source: InvoiceDbSource,

  invoiceId: number,

  payload: PlatformInvoiceSavePayload,

  settings: Awaited<ReturnType<typeof fetchPlatformInvoiceGlobals>>,

) {

  await executeSource(source, 'DELETE FROM cic_platform_invoice_line WHERE invoice_id = ?', [invoiceId]);



  for (const line of payload.lines) {

    if (!line.description.trim()) {

      continue;

    }



    const pct = Math.max(0, line.upchargePercent);

    const flat = Math.max(0, line.upchargeFlat ?? 0);

    const qty = line.qty > 0 ? line.qty : 1;



    await executeSource(

      source,

      `INSERT INTO cic_platform_invoice_line

        (invoice_id, line_code, sort_order, description, base_amount, upcharge_percent, upcharge_flat, usage_month, qty)

       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

      [

        invoiceId,

        line.lineCode || 'custom',

        line.sortOrder,

        line.description.trim(),

        line.baseAmount,

        pct,

        flat,

        line.usageMonth,

        qty,

      ],

    );

  }

}



export async function createPlatformInvoice(source: InvoiceDbSource, payload: PlatformInvoiceSavePayload) {

  await ensureInvoiceTables(source);

  await ensureNullableUserId(source);

  const settings = await fetchPlatformInvoiceGlobals(source);

  const title = payload.title.trim() || defaultInvoiceTitle();



  const result = await executeSource(

    source,

    `INSERT INTO cic_platform_invoice (date_created, user_id, title, notes, currency)

     VALUES (NOW(), NULL, ?, ?, ?)`,

    [title, payload.notes ?? '', settings.stripeCurrency],

  );



  const invoiceId = Number(result.insertId);

  if (!invoiceId) {

    throw new Error('Could not create invoice.');

  }



  await persistLines(source, invoiceId, payload, settings);

  return invoiceId;

}



export async function updatePlatformInvoice(

  source: InvoiceDbSource,

  invoiceId: number,

  payload: PlatformInvoiceSavePayload,

) {

  await ensureInvoiceTables(source);



  const locked = await querySource(

    source,

    'SELECT stripe_invoice_id FROM cic_platform_invoice WHERE id = ? LIMIT 1',

    [invoiceId],

  );

  if (locked[0]?.stripe_invoice_id) {

    throw new Error('This invoice is linked to Stripe and cannot be edited.');

  }



  const settings = await fetchPlatformInvoiceGlobals(source);

  const userId = readUserId(payload.userId);



  if (userId !== null) {

    await executeSource(

      source,

      'UPDATE cic_platform_invoice SET title = ?, notes = ?, user_id = ? WHERE id = ?',

      [payload.title.trim() || defaultInvoiceTitle(), payload.notes ?? '', userId, invoiceId],

    );

  } else {

    await executeSource(

      source,

      'UPDATE cic_platform_invoice SET title = ?, notes = ? WHERE id = ?',

      [payload.title.trim() || defaultInvoiceTitle(), payload.notes ?? '', invoiceId],

    );

  }



  await persistLines(source, invoiceId, payload, settings);

}



export async function deletePlatformInvoice(source: InvoiceDbSource, invoiceId: number) {

  await ensureInvoiceTables(source);



  const locked = await querySource(

    source,

    'SELECT stripe_invoice_id FROM cic_platform_invoice WHERE id = ? LIMIT 1',

    [invoiceId],

  );

  if (!locked.length) {

    throw new Error('Invoice not found.');

  }

  if (locked[0]?.stripe_invoice_id) {

    throw new Error('Cannot delete an invoice that is already linked to Stripe.');

  }



  await executeSource(source, 'DELETE FROM cic_platform_invoice_line WHERE invoice_id = ?', [invoiceId]);

  await executeSource(source, 'DELETE FROM cic_platform_invoice WHERE id = ?', [invoiceId]);

}



export async function markStripeLinked(

  source: InvoiceDbSource,

  invoiceId: number,

  stripe: {

    id: string;

    number: string | null;

    status: string | null;

    hostedInvoiceUrl: string | null;

    dashboardUrl: string;

  },

) {

  await executeSource(

    source,

    `UPDATE cic_platform_invoice

     SET stripe_invoice_id = ?, stripe_invoice_number = ?, stripe_invoice_status = ?,

         stripe_hosted_invoice_url = ?, stripe_dashboard_url = ?

     WHERE id = ?`,

    [

      stripe.id,

      stripe.number ?? '',

      stripe.status ?? '',

      stripe.hostedInvoiceUrl ?? '',

      stripe.dashboardUrl,

      invoiceId,

    ],

  );

}


