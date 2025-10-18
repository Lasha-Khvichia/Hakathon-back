import { IsDate, IsInt } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  userId: number;

  @IsInt()
  companyId: number;

  @IsDate()
  booked: Date;
}
