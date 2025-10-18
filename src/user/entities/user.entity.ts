import { Base } from "src/base.entity";
import { Column, Entity } from "typeorm";

export enum RolesEnum {
    user = 'user'
    
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
        default: RolesEnum.user
    })
    role: string;
}
