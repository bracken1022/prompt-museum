import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from '../entities/prompt.entity';
import { User } from '../entities/user.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private promptRepository: Repository<Prompt>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPromptDto: CreatePromptDto, userId: number): Promise<Prompt> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const prompt = this.promptRepository.create({
      ...createPromptDto,
      user_id: userId,
      is_public: createPromptDto.is_public ?? true,
    });

    return this.promptRepository.save(prompt);
  }

  async findAll(agent?: string, category?: string, search?: string): Promise<Prompt[]> {
    const queryBuilder = this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.user', 'user')
      .where('prompt.is_public = :isPublic', { isPublic: true })
      .orderBy('prompt.created_at', 'DESC');

    if (agent && agent !== 'all') {
      queryBuilder.andWhere('prompt.agent = :agent', { agent });
    }

    if (category && category !== 'all') {
      queryBuilder.andWhere('prompt.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(prompt.title LIKE :search OR prompt.description LIKE :search OR JSON_SEARCH(prompt.tags, "one", :search) IS NOT NULL)',
        { search: `%${search}%` }
      );
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Prompt> {
    const prompt = await this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.user', 'user')
      .where('prompt.id = :id', { id })
      .getOne();

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }

    return prompt;
  }

  async findByUser(userId: number): Promise<Prompt[]> {
    return this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.user', 'user')
      .where('prompt.user_id = :userId', { userId })
      .orderBy('prompt.created_at', 'DESC')
      .getMany();
  }

  async update(id: number, updatePromptDto: UpdatePromptDto, userId: number): Promise<Prompt> {
    const prompt = await this.promptRepository.findOne({
      where: { id, user_id: userId }
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found or you don't have permission to update it`);
    }

    await this.promptRepository.update(id, updatePromptDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const prompt = await this.promptRepository.findOne({
      where: { id, user_id: userId }
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found or you don't have permission to delete it`);
    }

    await this.promptRepository.delete(id);
  }

  async toggleLike(id: number): Promise<Prompt> {
    const prompt = await this.findOne(id);
    prompt.likes_count = Math.max(0, prompt.likes_count + 1); // Simple increment for now
    return this.promptRepository.save(prompt);
  }

  async getCategories(): Promise<string[]> {
    const result = await this.promptRepository
      .createQueryBuilder('prompt')
      .select('DISTINCT prompt.category', 'category')
      .where('prompt.is_public = :isPublic', { isPublic: true })
      .getRawMany();

    return result.map(item => item.category);
  }

  async getAgents(): Promise<string[]> {
    const result = await this.promptRepository
      .createQueryBuilder('prompt')
      .select('DISTINCT prompt.agent', 'agent')
      .where('prompt.is_public = :isPublic', { isPublic: true })
      .getRawMany();

    return result.map(item => item.agent);
  }
}
