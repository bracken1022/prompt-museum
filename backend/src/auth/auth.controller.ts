import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: { name: string; email: string; password: string }) {
    return this.authService.register(registerDto.name, registerDto.email, registerDto.password);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: { email: string }) {
    return this.authService.forgotPassword(forgotDto.email);
  }
}
