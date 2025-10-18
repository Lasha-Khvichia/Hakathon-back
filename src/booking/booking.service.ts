import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(data: CreateBookingDto) {
    const user = await this.userRepo.findOne({
      where: { id: data.userId },
      relations: ['bookings'],
    });

    if (!user) {
      throw new NotFoundException('There is no user on id: ' + data.userId);
    }

    const company = await this.companyRepo.findOne({
      where: { id: data.companyId },
      relations: ['bookings'],
    });

    if (!company) {
      throw new NotFoundException(
        'There is no company on the id: ' + data.companyId,
      );
    }

    const booking = this.bookingRepo.create({
      ...data,
      company,
      user,
    });

    return await this.bookingRepo.save(booking);
  }

  async findAll() {
    return await this.bookingRepo.find();
  }

  async findOne(id: number) {
    const find = await this.bookingRepo.findOne({
      where: { id },
    });

    if (!find) {
      throw new NotFoundException('There is no booking on id: ' + id);
    }

    return find;
  }

  async update(id: number, data: UpdateBookingDto) {
    await this.findOne(id);

    const update = this.bookingRepo.create(data);

    return await this.bookingRepo.save(update);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.bookingRepo.delete(id);
  }
}
