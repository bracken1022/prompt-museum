import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Prompt } from './entities/prompt.entity';
import { PromptsModule } from './prompts/prompts.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_URL?.startsWith('postgres') 
        ? 'postgres' 
        : process.env.DATABASE_URL?.startsWith('mysql') 
          ? 'mysql' 
          : (process.env.MYSQL_URL ? 'mysql' : 'mysql'), // Default to MySQL
      url: process.env.DATABASE_URL || process.env.MYSQL_URL,
      host: (process.env.DATABASE_URL || process.env.MYSQL_URL) ? undefined : (process.env.DB_HOST || process.env.MYSQLHOST || 'localhost'),
      port: (process.env.DATABASE_URL || process.env.MYSQL_URL) ? undefined : parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
      username: (process.env.DATABASE_URL || process.env.MYSQL_URL) ? undefined : (process.env.DB_USERNAME || process.env.MYSQLUSER || 'prompt_user'),
      password: (process.env.DATABASE_URL || process.env.MYSQL_URL) ? undefined : (process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'prompt_password'),
      database: (process.env.DATABASE_URL || process.env.MYSQL_URL) ? undefined : (process.env.DB_DATABASE || process.env.MYSQLDATABASE || 'prompt_museum'),
      entities: [User, Prompt],
      synchronize: true, // Enable for initial table creation
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    PromptsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
