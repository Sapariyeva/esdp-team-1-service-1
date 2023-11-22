import { params } from '@/config/enviroment';
import { QrDTO } from '@/dto/qr.dto';
import { encryptQr } from '@/helpers/cipher';
import { QrRepository } from '@/repositories/qr.repository';
import { randomUUID } from 'crypto';
import QRCode from "qrcode";

export class QrService {
  private repository: QrRepository;

  constructor() {
    this.repository = new QrRepository();
  }

  public generateQr = async (dto: QrDTO): Promise<string | void> => {
    try {
      dto.uuid = randomUUID();
      const cryptedUuid = encryptQr(JSON.stringify(dto.uuid), params.secret);
      const svg = await QRCode.toString(cryptedUuid, {type: 'svg'});
      dto.svg = Buffer.from(svg).toString('base64');
      const qrData = await this.repository.createQr(dto);
      return `${params.qrBaseUrl}${qrData.uuid}` 
    } catch (err) {
      console.log(err);
    } 
  }
}
