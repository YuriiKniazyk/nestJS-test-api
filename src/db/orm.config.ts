import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ['**/*.entity.{js,ts}'],
  migrationsTableName: 'migrations',
  migrations: [path.join(__dirname, '..', 'db/migrations/*.ts')],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};
