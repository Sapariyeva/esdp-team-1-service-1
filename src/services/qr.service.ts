import { QrRepository } from '@/repositories/qr.repository';

export class QrService {
  private repository: QrRepository;

  constructor() {
    this.repository = new QrRepository();
  }

  //methods will be here
}
