import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTaskDTO {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsOptional()
  name: string;
  @IsDateString()
  @IsOptional()
  deadline: Date;
}
