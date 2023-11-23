import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/user-create-input.dto';
import { UserOutput } from '../dto/user-output.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<User> {
    const user = await this.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  // Create User
  async createUser(input: CreateUserInput): Promise<User> {
    const user = this.create(input);
    await this.save(user);
    return user;
  }

  // Get User By Id
  // async getUserById(id: string): Promise<User> {
  //   // const user = await this.findOne({ where: { id: id } });
  //   const user = await this.findOne({ where: { id } });
  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }
  //   return user;
  // }

  // Get User By Email
  async getUserByEmail(email: string): Promise<any> {
    const user: User = await this.findOne({ where: { email: email } });
    if (!user) {
      return false;
    }
    return user;
  }

  async getUserBYRefreshToken(refreshToken: string) {
    return await this.findOne({ where: { refreshToken } });
  }

  async updateUser(user: User, ctx: any) {
    const savedUser = await this.save(user);
    const userOutput = new UserOutput(savedUser);
    return userOutput;
  }
}
