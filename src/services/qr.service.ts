import { params } from '@/config/enviroment';
import { QrDTO } from '@/dto/qr.dto';
import { decryptQr, encryptQr } from '@/helpers/cipher';
import { IValidateQr } from '@/interfaces/qr.interface';
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
      const cryptedUuid = encryptQr(dto.uuid, params.secret);
      const svg = await QRCode.toString(cryptedUuid, {type: 'svg'});
      dto.svg = Buffer.from(svg).toString('base64');
      const qrData = await this.repository.createQr(dto);
      return `${params.qrBaseUrl}${qrData.uuid}` 
    } catch (err) {
      console.log(err);
    } 
  }

  public validateQr = async (data: IValidateQr): Promise<boolean> => {
    const decryptedUuid = decryptQr(data.hash, params.secret);
    const qr = await this.repository.getQrByUUID(decryptedUuid);
    if (!qr) {
      return false;
    } else {
      const currentTimestamp = new Date().getTime();
      const lockPermission = qr.locks.includes(data.lock);
      if (!lockPermission) {
        return false;
      } else if (currentTimestamp > qr.valid_from && currentTimestamp < qr.valid_to) {
        return true;
      } else {
        return false;
      }
    }
  } 
}
