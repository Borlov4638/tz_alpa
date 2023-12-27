import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserRegistrationDTO {
  @Matches(/^\S+@\S+\.\S+$/)
  email: string;
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  password: string;
}
