import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Category } from '../category/entities/category.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const category = await this.categoryRepository.findOneBy({
        id: createCompanyDto.categoryId,
      });
      if (!category)
        throw new NotFoundException(
          `Category with ID ${createCompanyDto.categoryId} not found`,
        );

      const company = this.companyRepository.create({
        ...createCompanyDto,
        category,
      });
      return await this.companyRepository.save(company);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        'Failed to create company: ' + error.message,
      );
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return await this.companyRepository.find({ relations: ['category'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch companies');
    }
  }

  async findOne(id: number): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ['category'],
      });
      if (!company)
        throw new NotFoundException(`Company with ID ${id} not found`);
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch company');
    }
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    try {
      const company = await this.findOne(id);

      if (updateCompanyDto.categoryId) {
        const category = await this.categoryRepository.findOneBy({
          id: updateCompanyDto.categoryId,
        });
        if (!category)
          throw new NotFoundException(
            `Category with ID ${updateCompanyDto.categoryId} not found`,
          );
        company.category = category;
      }

      Object.assign(company, updateCompanyDto);
      return await this.companyRepository.save(company);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        'Failed to update company: ' + error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const company = await this.findOne(id);
      await this.companyRepository.delete(company);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete company');
    }
  }
}
