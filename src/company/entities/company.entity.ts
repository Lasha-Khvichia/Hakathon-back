import { Base } from 'src/base.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Category } from 'src/category/entities/category.entity';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Company extends Base {
  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => Category, (category) => category.companies, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Booking, (booking) => booking.company)
  bookings: Booking[];
}
