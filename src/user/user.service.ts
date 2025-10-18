import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    const find = this.repo.findOne({ where: { name: username } });

    if (!find) {
      throw new NotFoundException('There is no user on name: ' + username)
    }

    return find;
  }

  async create(data: CreateUserDto, role = 'user') {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.repo.create({ ...data, password: hashed, role });
    return this.repo.save(user);
  }

  async update(id: number, data: UpdateUserDto) {}

  async remove(id: number) {}
}
