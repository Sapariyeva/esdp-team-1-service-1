import cors from 'cors';
import { App } from './app';
import { QrRoute } from './routes/qr.route';
import { params } from './config/enviroment';
import { WeeklyQrRoute } from './routes/weeklyQr.route';

const app = new App({
  port: params.port,
  middlewares: [cors()],
  controllers: [
    new QrRoute(),
    new WeeklyQrRoute()
  ],
});

app.listen();

