import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create category: ' + error.message,
      );
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({ relations: ['companies'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['companies'],
      });
      if (!category)
        throw new NotFoundException(`Category with ID ${id} not found`);
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.findOne(id);
      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        'Failed to update category: ' + error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const category = await this.findOne(id);
      await this.categoryRepository.delete(category);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
