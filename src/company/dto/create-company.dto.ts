import { IsInt, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    name: string;

    @IsInt()
    categoryId: number;
}
