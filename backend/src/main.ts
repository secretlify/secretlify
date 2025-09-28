import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MetricsInterceptor } from './shared/posthog/metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({ origin: '*' });

  app.useGlobalInterceptors(new MetricsInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', in: 'header', name: 'project-api-key' }, 'project-api-key')
    .setTitle('Secretlify')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

process.on('uncaughtException', (error) => {
  console.error(error);
});

process.on('unhandledRejection', (error) => {
  console.error(error);
});

process.on('uncaughtExceptionMonitor', (error) => {
  console.error(error);
});
