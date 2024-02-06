import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.POSTGRES_DB_HOST}`,
  port: +`${process.env.POSTGRES_DB_PORT}`,
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASS}`,
  database: `${process.env.POSTGRES_DB_NAME}`,
  ssl: process.env.POSTGRES_SSL === 'true',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  schema: `${process.env.POSTGRES_SCHEMA}`,
  synchronize: false,
  logging: true,
  migrationsTableName: 'kedu_mirgation',
  migrationsRun: true,
} satisfies DataSourceOptions;

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
