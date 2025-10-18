import { Base } from 'src/base.entity';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Booking extends Base {
  @Column({ type: 'timestamp' })
  booked: Date;

  @Column()
  ticket: string;

  @ManyToOne(() => Company, (company) => company.bookings, { cascade: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => User, (user) => user.bookings, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
