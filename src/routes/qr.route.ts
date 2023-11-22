import { QrController } from '@/controllers/qr.controller';
import { Router } from 'express';
import { IRoute } from '../interfaces/route.interface';

export class QrRoute implements IRoute {
  public path = '/';
  public router = Router();
  private controller: QrController;

  constructor() {
    this.controller = new QrController();
    this.init();
  }

  private init() {
    this.router.post('/generate', this.controller.generateQr);
    this.router.post('/validate', this.controller.validateQr);
  }
}
