import { QrController } from '@/controllers/qr.controller';
import { Router } from 'express';
import { IRoute } from '@/interfaces/route.interface';
import { WeeklyQrController } from '@/controllers/weeklyQr.controller';


export class WeeklyQrRoute implements IRoute {
  public path = '/';
  public router = Router();
  private controller: WeeklyQrController;
  private defaultQrController: QrController;

  constructor() {
    this.controller = new WeeklyQrController();
    this.defaultQrController = new   QrController()
    this.init();
  }

  private init() {
    this.router.post('/generateWeekly', this.controller.generateQr);
    this.router.get('/validate', this.defaultQrController.validateQr);
    this.router.get('/weekly/:uuid', this.controller.renderQr);
  }
}
