import { Base } from 'src/base.entity';
import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends Base {
  @Column()
  name: string;

  @OneToMany(() => Company, (company) => company.category)
  companies: Company[];
}
