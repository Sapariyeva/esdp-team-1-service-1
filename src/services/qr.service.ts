import { params } from '@/config/enviroment';
import { QrDTO } from '@/dto/qr.dto';
import { decryptQr, encryptQr } from '@/helpers/cipher';
import { ILog, IQrCode, IValidateQr } from '@/interfaces/qr.interface';
import { QrRepository } from '@/repositories/qr.repository';
import QRCode from 'qrcode';
import axios, { AxiosInstance } from 'axios';

export class QrService {
  private repository: QrRepository;
  private logAxios: AxiosInstance = axios.create({ baseURL: 'http://localhost:8002' });

  constructor() {
    this.repository = new QrRepository();
  }

  public generateQr = async (dto: QrDTO): Promise<string | void> => {
    try {
      const cryptedUuid = encryptQr(dto.id!, params.secret);
      const svg = await QRCode.toString(cryptedUuid, { type: 'svg' });
      dto.svg = Buffer.from(svg).toString('base64');
      const qrData = await this.repository.createQr(dto);
      return `${params.qrBaseUrl}${qrData.uuid}`;
    } catch (err) {
      console.log(err);
    }
  };
  public getQrSvg = async (uuid: string): Promise<string | null> => {
    const qr: IQrCode | null = await this.repository.getQrByUUID(uuid);
    return qr ? qr.svg : null;
  };
  public validateQr = async (data: IValidateQr): Promise<boolean> => {
    const decryptedUuid = decryptQr(data.hash, params.secret);
    const qr = await this.repository.getQrByUUID(decryptedUuid);
    const log: ILog = {
      access_uuid: decryptedUuid,
      lock: data.lock,
      phone: qr?.phone,
      attempted_at: new Date().getTime(),
      attempt_status: false,
    };

    if (!qr) {
      await this.logAxios.post('/logs', log);
      return false;
    }

    const currentTimestamp = new Date().getTime();
    log.attempt_status = qr.locks.includes(data.lock);
    await this.logAxios.post('/logs', log);
    return log.attempt_status && currentTimestamp > qr.valid_from && currentTimestamp < qr.valid_to;
  };
}
