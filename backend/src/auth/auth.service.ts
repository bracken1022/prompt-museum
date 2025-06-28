import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return { success: false, message: 'Invalid credentials' };
      }

      const token = this.generateToken(user);

      return { 
        success: true, 
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email },
        access_token: token
      };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);
      const token = this.generateToken(savedUser);

      return { 
        success: true, 
        message: 'Registration successful',
        user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
        access_token: token
      };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // In a real application, you would:
      // 1. Generate a password reset token
      // 2. Save it to the database with expiration
      // 3. Send email with reset link
      
      return { 
        success: true, 
        message: 'Password reset email sent (simulated)'
      };
    } catch (error) {
      return { success: false, message: 'Password reset failed' };
    }
  }
}
