import { Base } from 'src/base.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum RolesEnum {
  user = 'user',
}

@Entity()
export class User extends Base {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.user,
  })
  role: RolesEnum;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
