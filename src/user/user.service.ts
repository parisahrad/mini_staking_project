import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UserRole } from "src/common/type";

@Injectable()
export class UserService{
    create(email: string, hashedPassword: any, fullName: string | undefined, USER: UserRole) {
        throw new Error('Method not implemented.');
    }
    findByEmail(email: string): User | PromiseLike<User | null> | null {
        throw new Error('Method not implemented.');
    }


    async findById(sub: string) : Promise<User>{
        throw new Error('Method not implemented.');
    }
}