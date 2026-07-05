import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // Préfixe global -> toutes les routes commencent par /api (attendu par le frontend)
  app.setGlobalPrefix('api');

  // Sert les images uploadées (evana-api/uploads/xxx.jpg) sur http://localhost:PORT/uploads/xxx.jpg
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  // Validation automatique des DTO (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non déclarés dans les DTO
      forbidNonWhitelisted: true, // rejette une requête contenant des champs inconnus
      transform: true, // transforme les payloads en instances de classe typées
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Gestion centralisée des erreurs HTTP
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS pour permettre au frontend Vite de consommer l'API
  app.enableCors({
    origin: config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173',
    credentials: true,
  });

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`🚀 EVANA API démarrée sur http://localhost:${port}/api`);
}
bootstrap();
