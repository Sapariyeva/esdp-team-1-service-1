import { params } from '@/config/enviroment';
import { QrDTO } from '@/dto/qr.dto';
import { decryptQr, encryptQr } from '@/helpers/cipher';
import { ILog, IQrCode, IValidateQr } from '@/interfaces/qr.interface';
import { QrRepository } from '@/repositories/qr.repository';
import QRCode from 'qrcode';
import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class QrService {
  private repository: QrRepository;
  private logAxios: AxiosInstance;
  private secretKey: string;
  private hashKey: string;

  constructor() {
    this.repository = new QrRepository();
    this.logAxios = axios.create({ baseURL: params.logBaseUrl });
    this.secretKey = params.secret || '';
    this.hashKey = params.secretHTTP || '';
  }

  private createSignature(data: string): string {
    const hmac = crypto.createHmac('sha256', this.secretKey);
    return hmac.update(data).digest('hex');
  }

  private async sendRequest(data: any): Promise<any> {
    const signature = this.createSignature(JSON.stringify(data));
    const headers = {
      'X-Signature': signature,
      'X-Secret-Hash': await bcrypt.hash(this.secretKey, 10),
    };

    try {
      const response = await axios.post(params.qrBaseUrl, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending request:', error);
      throw new Error('Failed to send request.');
    }
  }

  public generateQr = async (dto: QrDTO): Promise<string | void> => {
    try {
      const cryptedUuid = encryptQr(dto.id!, params.secret);
      const svg = await QRCode.toString(cryptedUuid, { type: 'svg' });
      dto.svg = Buffer.from(svg).toString('base64');
      const qrData = await this.repository.createQr(dto);

      const signatureData = {
        type: 'generateQr',
        data: dto,
      };
      const signature = this.createSignature(JSON.stringify(signatureData));

      const requestData = {
        ...signatureData,
        signature: signature,
      };

      const response = await this.sendRequest(requestData);

      if (response.success) {
        return `${params.qrBaseUrl}${qrData.uuid}`;
      } else {
        throw new Error('Failed to generate QR in the other service.');
      }
    } catch (err) {
      console.error('Error generating QR:', err);
      throw new Error('Failed to generate QR.');
    }
  };

  public getQrSvg = async (uuid: string): Promise<string | null> => {
    const qr: IQrCode | null = await this.repository.getQrByUUID(uuid);
    return qr ? qr.svg : null;
  };

  public validateQr = async (data: IValidateQr): Promise<boolean> => {
    const log: ILog = {
      access_uuid: null,
      lock: data.lock,
      phone: null,
      attempted_at: new Date().getTime(),
      attempt_status: false,
    };

    if (!data.hash) {
      log.access_uuid = 'validate error'; // только для того чтобы отличить в базе
      await this.logAxios.post('/logs', log);
      return false;
    }

    try {
      const decryptedUuid = decryptQr(data.hash, params.secret);
      const qr = await this.repository.getQrByUUID(decryptedUuid);

      if (qr) {
        log.access_uuid = decryptedUuid;
        log.phone = qr.phone;
        const currentTimestamp = new Date().getTime();
        log.attempt_status = qr.locks.includes(data.lock) && currentTimestamp > qr.valid_from && currentTimestamp < qr.valid_to;
      }

      await this.logAxios.post('/logs', log);
      return log.attempt_status;
    } catch (error) {
      await this.logAxios.post('/logs', log);
      return false;
    }
  };
}
