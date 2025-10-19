import { IsInt, IsString, IsUrl } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    name: string;

    @IsInt()
    categoryId: number;

    @IsUrl()
    url: string;
}
