import { QrService } from '@/services/qr.service';

export class QrController {
  private service: QrService;

  constructor() {
    this.service = new QrService();
  }

  //methods will be here
}
