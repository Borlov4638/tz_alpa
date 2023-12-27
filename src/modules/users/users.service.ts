import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ){}

    async createUser(email:string, password: string): Promise<UserEntity>{
        if (await this.isUserExistsByEmail(email)){
            throw new BadRequestException('user with this email already exists!');
        }
        const user = new UserEntity();
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        await this.userRepo.save(user);
        return user
    }

    async getUserByEmail(email:string): Promise<UserEntity>{
        return await this.userRepo.findOne({
            where:{
                email
            },
            select:{
                id: true,
                email:true,
                password: true
            }
        })
    }

    async checkUsersCredentials(usersPassword:string, password:string): Promise<Boolean>{
        return !!(await bcrypt.compare(
            password,
            usersPassword,
          ))
    }

    async isUserExistsByEmail(email: string): Promise<Boolean>{
        return !!(await this.userRepo.findOne({
            where: {
              email
            },
            select:{
              id:true
            }
        }))
    }
}