import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export interface DatabaseModuleOptions {
  entities: EntityClassOrSchema[];
}

@Module({})
export class DatabaseModule {
  static forFeature(entities: EntityClassOrSchema[]): DynamicModule {
    return TypeOrmModule.forFeature(entities);
  }

  static forRoot(options?: Partial<DatabaseModuleOptions>): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'mssql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '1433', 10),
            username: process.env.DB_USERNAME || 'sa',
            password: process.env.DB_PASSWORD || 'YourStrong@Password123',
            database: process.env.DB_NAME || 'QL_CuaHangTienLoi',
            entities: options?.entities || [],
            // STRICT RULE: No schema alterations
            synchronize: false,
            migrationsRun: false,
            autoLoadEntities: false,
            logging: process.env.DB_LOGGING === 'true',
            options: {
              encrypt: false,
              trustServerCertificate: true,
              enableArithAbort: true,
            },
            extra: {
              connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
              requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT || '30000', 10),
            },
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}

