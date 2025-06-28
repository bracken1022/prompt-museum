import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { Public } from '../auth/public.decorator';
import { User } from '../entities/user.entity';

@Controller('prompts')
@UseGuards(JwtAuthGuard)
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  async create(@Body() createPromptDto: CreatePromptDto, @GetUser() user: User) {
    return this.promptsService.create(createPromptDto, user.id);
  }

  @Public()
  @Get()
  async findAll(
    @Query('agent') agent?: string,
    @Query('category') category?: string,
    @Query('search') search?: string
  ) {
    return this.promptsService.findAll(agent, category, search);
  }

  @Public()
  @Get('categories')
  async getCategories() {
    return this.promptsService.getCategories();
  }

  @Public()
  @Get('agents')
  async getAgents() {
    return this.promptsService.getAgents();
  }

  @Get('my-prompts')
  async findMyPrompts(@GetUser() user: User) {
    return this.promptsService.findByUser(user.id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.promptsService.findOne(parseInt(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updatePromptDto: UpdatePromptDto,
    @GetUser() user: User
  ) {
    return this.promptsService.update(parseInt(id), updatePromptDto, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.promptsService.remove(parseInt(id), user.id);
  }

  @Public()
  @Post(':id/like')
  async toggleLike(@Param('id') id: string) {
    return this.promptsService.toggleLike(parseInt(id));
  }
}
