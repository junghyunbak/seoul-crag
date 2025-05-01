import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config({
  path: ['.env.dev', '.env.prod'],
});

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);
