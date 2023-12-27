import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name: string;
  @IsDateString()
  deadline: Date;
}
