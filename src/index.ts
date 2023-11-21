import cors from 'cors';
import { App } from './app';
import { QrRoute } from './routes/qr.route';
import { params } from './config/enviroment';

const app = new App({
  port: params.port,
  middlewares: [cors()],
  controllers: [
    new QrRoute(),
  ],
});

app.listen();

