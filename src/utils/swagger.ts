import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Function to setup swagger documentation
 * @param app Nest Application
 * @returns Promise<unknown>
 */
export function swagger(app: INestApplication<any>) {
  return new Promise((resolve) => {
    const options = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API Documentation for the application')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    resolve(app);
  });
}
