import { QrDTO } from '@/dto/qr.dto';
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
      const errs = await validate(dto, {whitelist: true});
      if (errs.length > 0) throw errs;
      const qrLink = await this.service.generateQr(dto);
      res.status(200).send({
        success: true,
        link: qrLink
      })
    } catch (err) {
      next(err);
    }
  };
}
