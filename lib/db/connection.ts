import type { InvoiceDbSource } from '@/lib/db/types';

export type MysqlConnectionConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type PostgresConnectionConfig = {
  connectionString: string;
};

function readPort(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function hasDiscreteMysqlConfig(source: InvoiceDbSource) {
  return Boolean(source.host && source.user && source.database);
}

export function resolveMysqlConfig(source: InvoiceDbSource): MysqlConnectionConfig | string {
  if (hasDiscreteMysqlConfig(source)) {
    return {
      host: source.host!,
      port: readPort(source.port, 3306),
      user: source.user!,
      password: source.password ?? '',
      database: source.database!,
    };
  }

  if (source.url) {
    return source.url;
  }

  throw new Error('Missing database connection. Provide host/user/database or url.');
}

export function resolvePostgresConfig(source: InvoiceDbSource): PostgresConnectionConfig {
  if (source.url) {
    return { connectionString: source.url };
  }

  if (hasDiscreteMysqlConfig(source)) {
    const port = readPort(source.port, 5432);
    const user = encodeURIComponent(source.user!);
    const password = encodeURIComponent(source.password ?? '');
    const host = source.host!;
    const database = source.database!;
    return {
      connectionString: `postgres://${user}:${password}@${host}:${port}/${database}`,
    };
  }

  throw new Error('Missing database connection. Provide host/user/database or url.');
}
