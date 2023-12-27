import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostgreSQLConfigService } from "./database-config.service";

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useClass: PostgreSQLConfigService,
            inject: [PostgreSQLConfigService]
          })
        
    ],
    providers:[PostgreSQLConfigService]
})
export class DatabaseModule{}