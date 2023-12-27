import { UserRegistrationDTO } from './dto/user-registration.dto';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService : UserService
  ) {}

  async userRegistration(userData: UserRegistrationDTO): Promise<void> {

    await this.userService.createUser(userData.email, userData.password)
  }

  async userLogin(data: UserLoginDTO): Promise<string> {
    
    const user = await this.userService.getUserByEmail(data.email)

    if (!user){
      throw new UnauthorizedException();
    }

    if (await this.userService.checkUsersCredentials(user.password, data.password)){
      throw new UnauthorizedException();
    } 
    return this.getAccessToken(user.id, user.email)
  }

  private async getAccessToken(id:number, email:string): Promise<string>{
    return await this.jwtService.signAsync(
      { id, email },
      { expiresIn: '1h' },
    );
  }
}
