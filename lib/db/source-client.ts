import mysql, { type Connection, type ResultSetHeader } from 'mysql2/promise';
import { Pool } from 'pg';
import { resolveMysqlConfig, resolvePostgresConfig } from '@/lib/db/connection';
import type { InvoiceDbSource } from '@/lib/db/types';

export type RawRow = Record<string, unknown>;

function isPostgresSource(source: InvoiceDbSource) {
  const target = source.url ?? '';
  return target.startsWith('postgres://') || target.startsWith('postgresql://');
}

export async function withMysqlConnection<T>(
  source: InvoiceDbSource,
  fn: (connection: Connection) => Promise<T>,
): Promise<T> {
  const config = resolveMysqlConfig(source);
  const connection =
    typeof config === 'string' ? await mysql.createConnection(config) : await mysql.createConnection(config);
  try {
    return await fn(connection);
  } finally {
    await connection.end();
  }
}

export async function querySource(
  source: InvoiceDbSource,
  sql: string,
  params: unknown[] = [],
): Promise<RawRow[]> {
  if (isPostgresSource(source)) {
    const pool = new Pool(resolvePostgresConfig(source));
    try {
      const result = await pool.query(sql, params);
      return result.rows as RawRow[];
    } finally {
      await pool.end();
    }
  }

  return withMysqlConnection(source, async (connection) => {
    const [rows] = await connection.query(sql, params as never[]);
    return Array.isArray(rows) ? (rows as RawRow[]) : [];
  });
}

export async function executeSource(
  source: InvoiceDbSource,
  sql: string,
  params: unknown[] = [],
): Promise<ResultSetHeader | { insertId: number; affectedRows: number }> {
  if (isPostgresSource(source)) {
    const pool = new Pool(resolvePostgresConfig(source));
    try {
      const returningSql = /returning\s+/i.test(sql) ? sql : `${sql} RETURNING id`;
      const result = await pool.query(returningSql, params);
      const row = result.rows[0] as { id?: number } | undefined;
      return {
        insertId: Number(row?.id ?? 0),
        affectedRows: result.rowCount ?? 0,
      };
    } finally {
      await pool.end();
    }
  }

  return withMysqlConnection(source, async (connection) => {
    const [result] = await connection.execute(sql, params as never[]);
    return result as ResultSetHeader;
  });
}
