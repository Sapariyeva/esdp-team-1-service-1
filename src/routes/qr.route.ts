import { QrController } from '@/controllers/qr.controller';
import { Router } from 'express';
import { IRoute } from '@/interfaces/route.interface';
import { checkSecretKey, createSecretKey } from '@/middlewares/validateSecretKey';

export class QrRoute implements IRoute {
  public path = '/';
  public router = Router();
  private controller: QrController;

  constructor() {
    this.controller = new QrController();
    this.init();
  }

  private init() {
    this.router.use(createSecretKey);
    this.router.use(checkSecretKey);

    this.router.post('/generate', this.controller.generateQr);

    // Change the method for the validate route to GET
    this.router.get('/validate', this.controller.validateQr);

    this.router.get('/:uuid', this.controller.renderQr);
  }
}
