import { WeeklyQrDTO, WeeklyScheduleDTO } from '@/dto/qr.dto';
import { WeeklyQrService } from '@/services/weeklyQr.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';

export class WeeklyQrController {
  private service: WeeklyQrService;

  constructor() {
    this.service = new WeeklyQrService();
  }

  public generateQr: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const scheduleDTO = plainToInstance(WeeklyScheduleDTO, req.body.schedule);
      const scheduleErr = await validate(scheduleDTO, { whitelist: true });
      if (scheduleErr.length > 0) throw new Error('Malformed schedule');
      const dto = plainToInstance(WeeklyQrDTO, req.body);
      dto.schedule = scheduleDTO
      const errs = await validate(dto, { whitelist: true });
      if (errs.length > 0) throw errs;
      const qrLink = await this.service.generateQr(dto);
      if(!qrLink) throw new Error ('```````````````````````````No Weekly QR Link```````````````````````````````')
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
}
