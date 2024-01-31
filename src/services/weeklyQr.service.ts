import { params } from '@/config/enviroment';
import { WeeklyQrDTO } from '@/dto/qr.dto';
import { decryptQr, encryptQr } from '@/helpers/cipher';
import { ILog, IQrCode, IValidateQr, IWeeklyQrCode } from '@/interfaces/qr.interface';
import { WeeklyQrRepository } from '@/repositories/weeklyQr.repository';
import QRCode from 'qrcode';
// import axios, { AxiosInstance } from 'axios';

export class WeeklyQrService {
  private repository: WeeklyQrRepository;
  // private logAxios: AxiosInstance;

  constructor() {
    this.repository = new WeeklyQrRepository();
    // this.logAxios = axios.create({ baseURL: params.logBaseUrl });
  }

  public getQrByUUID = async (id:string) => {
    try{
      return this.repository.getQrByUUID(id)
    }
    catch{
      return null
    }
  }

  public generateQr = async (dto: WeeklyQrDTO): Promise<string | void> => {
    try {
      const cryptedUuid = encryptQr(dto.id!, params.secret);
      const svg = await QRCode.toString(cryptedUuid, { type: 'svg' });
      dto.svg = Buffer.from(svg).toString('base64');
      const qrData = await this.repository.createQr(dto);
      return `${params.qrBaseUrl}${'weekly/'}${qrData.uuid}`;
    } catch (err) {
      console.log(err);
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
      // await this.logAxios.post('/logs', log);
      return false;
    }

    try {
      const decryptedUuid = decryptQr(data.hash, params.secret);
      const qr = await this.repository.getQrByUUID(decryptedUuid);

      if (qr) {
        // log.access_uuid = decryptedUuid;
        // log.phone = qr.phone;
        // const currentTimestamp = new Date().getTime();
        // log.attempt_status = qr.locks.includes(data.lock) && currentTimestamp > qr.valid_from && currentTimestamp < qr.valid_to;
        return  checkWeeklyQrAttempt(qr, data)
      }
      // log.attempt_status = qr.locks.includes(data.lock) && currentTimestamp > qr.valid_from && currentTimestamp < qr.valid_to;

      // await this.logAxios.post('/logs', log);
      // return log.attempt_status;
      return false
    } catch (error) {
      // await this.logAxios.post('/logs', log);
      return false;
    }
  };
}

const checkWeeklyQrAttempt = (qr:IWeeklyQrCode, data: IValidateQr) => {
  const currentDate = new Date()
  const currentTimestamp = currentDate.getTime();
  const dayOfWeek = currentDate.getDay();
  const thisDaySchedule = qr.schedule[dayOfWeek]
  const currentMomentOfDay = currentTimestamp- {...currentDate}.setHours(0, 0, 0, 0);
  const isLockIncluded = qr.locks.includes(data.lock)
  const isNotExpired = currentTimestamp > qr.valid_from && currentTimestamp < qr.valid_to
  const isWithinDayAccess = (thisDaySchedule.isActive && 
    currentMomentOfDay>=thisDaySchedule.start &&
    currentMomentOfDay<= thisDaySchedule.end)
  return (isLockIncluded && isNotExpired && isWithinDayAccess)

}


