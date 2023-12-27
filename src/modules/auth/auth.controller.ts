import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserRegistrationDTO } from './dto/user-registration.dto';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('registration')
  async userRegistration(@Body() data: UserRegistrationDTO) {
    return await this.authService.userRegistration(data);
  }

  @Post('login')
  async userLogin(@Body() data: UserLoginDTO) {
    return await this.authService.userLogin(data);
  }
}
