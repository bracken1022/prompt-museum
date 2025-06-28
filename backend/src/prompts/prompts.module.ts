import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';
import { Prompt } from '../entities/prompt.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prompt, User])],
  controllers: [PromptsController],
  providers: [PromptsService]
})
export class PromptsModule {}
