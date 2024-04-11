import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // TODO: 到这里其实文件已经上传到服务器本地了，需要有后续的存储需求，比如要上传到云存储服务中，可以在这里继续处理
    const domain = this.configService.get('DOMAIN');
    const dest = this.configService.get('MULTER_DEST');
    return `${domain}/${dest}/${file.filename}`;
  }
}
