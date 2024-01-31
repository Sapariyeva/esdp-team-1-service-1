import { QrDTO, QrValidateDTO } from '@/dto/qr.dto';
import { decryptQr } from '@/helpers/cipher';
import { QrService } from '@/services/qr.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import { params } from '@/config/enviroment';
import { WeeklyQrService } from '@/services/weeklyQr.service';
import { IQrCode, IWeeklyQrCode } from '@/interfaces/qr.interface';

export class QrController {
  private service: QrService;
  private weeklyService: WeeklyQrService;

  constructor() {
    this.service = new QrService();
    this.weeklyService = new WeeklyQrService();
  }

  public generateQr: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const dto = plainToInstance(QrDTO, req.body);
      const errs = await validate(dto, { whitelist: true });
      if (errs.length > 0) throw errs;
      const qrLink = await this.service.generateQr(dto);
      if (!qrLink) throw new Error('No QR Link')
      res.status(200).send({
        success: true,
        link: qrLink,
      });
    } catch (err) {
      next(err);
    }
  };

  public renderQr: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { uuid } = req.params;
      const svg = await this.service.getQrSvg(uuid);
      res.render('index', { svg });
    } catch (err) {
      next(err);
    }
  };

  // Update to extract data from headers for validate route
  public validateQr: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const lock = req.headers['lock_uid'] as string;
      const hash = req.headers['hash'] as string;

      const dto = plainToInstance(QrValidateDTO, { lock, hash });
      const errs = await validate(dto, { whitelist: true });
      if (errs.length > 0) next(errs);
      const decryptedUuid = decryptQr(dto.hash, params.secret);
      let qr: IQrCode | null = null
      let weeklyQr: IWeeklyQrCode | null = null
      let permission = false
      {
        qr = await this.service.getQrByUUID(decryptedUuid)
        if (qr) {
          permission = qr? await this.service.validateQr(dto): false
        }
        else {
          weeklyQr = await this.weeklyService.getQrByUUID(decryptedUuid)
          permission = weeklyQr? await this.weeklyService.validateQr(dto): false
        }
      }
      if (permission) {
        res.status(200).send({
          success: true,
        });
      } else {
        res.status(403).send({
          success: false,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}
