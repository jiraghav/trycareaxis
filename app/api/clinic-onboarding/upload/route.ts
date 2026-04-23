import { NextResponse } from 'next/server';

function createId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}-${rand}`;
}

const MAX_FILE_BYTES = 3_000_000;
const MAX_FILES_PER_REQUEST = 4;

export async function POST(request: Request) {
  const form = await request.formData();
  const applicationId = String(form.get('applicationId') ?? '').trim();
  const kind = String(form.get('kind') ?? '').trim();

  if (!applicationId) {
    return NextResponse.json({ ok: false, error: 'Missing applicationId.' }, { status: 400 });
  }
  if (kind !== 'licensure' && kind !== 'insurance') {
    return NextResponse.json({ ok: false, error: 'Invalid document kind.' }, { status: 400 });
  }

  const files = form.getAll('files').filter((item) => item instanceof File) as File[];
  if (!files.length) {
    return NextResponse.json({ ok: false, error: 'No files received.' }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return NextResponse.json(
      { ok: false, error: `Too many files. Max ${MAX_FILES_PER_REQUEST} per upload.` },
      { status: 400 },
    );
  }

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { ok: false, error: `File too large: ${file.name}. Max ${Math.round(MAX_FILE_BYTES / 1_000_000)}MB.` },
        { status: 400 },
      );
    }
  }

  const uploadIds = files.map(() => createId('CICDOC'));

  const webhook = process.env.CARE_AXIS_LEAD_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Document uploads are not configured in this environment. Please continue and we will request documents via a secure link.',
      },
      { status: 503 },
    );
  }

  try {
    const docs = await Promise.all(
      files.map(async (file, index) => {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        return {
          uploadId: uploadIds[index],
          kind,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          contentBase64: base64,
        };
      }),
    );

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'clinic_onboarding_docs',
        source: 'cic_clinic_onboarding',
        applicationId,
        submittedAt: new Date().toISOString(),
        documents: docs,
      }),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to upload documents right now. Please try again or continue without uploads.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    applicationId,
    kind,
    uploadIds,
  });
}
