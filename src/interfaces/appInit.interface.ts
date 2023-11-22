import { RequestHandler } from 'express';
import { IRoute } from './route.interface';

export interface AppInit {
  port: number;
  middlewares: RequestHandler[];
  controllers: IRoute[];
}
