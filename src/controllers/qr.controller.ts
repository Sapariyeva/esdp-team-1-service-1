import { QrDTO, QrValidateDTO } from '@/dto/qr.dto';
import { QrService } from '@/services/qr.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';

export class QrController {
  private service: QrService;

  constructor() {
    this.service = new QrService();
  }

  public generateQr: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const dto = plainToInstance(QrDTO, req.body);
      const errs = await validate(dto, { whitelist: true });
      if (errs.length > 0) throw errs;
      const qrLink = await this.service.generateQr(dto);
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

  public validateQr: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const dto = plainToInstance(QrValidateDTO, req.body);
      const errs = await validate(dto, { whitelist: true });
      if (errs.length > 0) next(errs);
      const permission = await this.service.validateQr(dto);
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
