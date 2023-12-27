import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class PostgreSQLConfigService implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('PG_HOST'),
            port: parseInt(process.env.PG_PORT, 10),
            username: this.configService.get<string>('PG_USER'),
            password: this.configService.get<string>('PG_PASSWORD'),
            database: this.configService.get<string>('PG_DATABASE'),
            synchronize: false,
            autoLoadEntities: true,
    };
  }
}


