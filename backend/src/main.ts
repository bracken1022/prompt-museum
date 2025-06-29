import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS for both development and production
  const productionOrigins = [
    'https://prompt-museum.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean);
  
  const corsOrigins = process.env.NODE_ENV === 'production' 
    ? productionOrigins
    : ['http://localhost:3001', 'http://localhost:3000'];
    
  console.log('🔧 CORS Configuration:');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('CORS_ORIGIN env var:', process.env.CORS_ORIGIN);
  console.log('Allowed origins:', corsOrigins);
    
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
