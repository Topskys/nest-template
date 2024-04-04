import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: join(process.cwd(), configService.get('MULTER_DEST')),
          filename: (req, file, callback) => {
            const origName = file.originalname;
            const fileName = `${new Date().getTime()}${extname(origName)}`;
            return callback(null, fileName);
          },
        }),
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
