import express, { Application, RequestHandler } from 'express';
import { AppInit } from './interfaces/appInit.interface';
import { IRoute } from './interfaces/route.interface';
import path from 'path';
import { appDataSource } from './config/dataSource';
import { errorHandler } from './middlewares/errorHandler.middleware';

export class App {
  public app: Application;
  public port: number;
  constructor(appInit: AppInit) {
    this.app = express();
    this.port = appInit.port;
    this.initAssets();
    this.initMiddlewares(appInit.middlewares);
    this.initRoutes(appInit.controllers);
    this.initErrorHandlers();
  }

  private initRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }
  
  private initMiddlewares(middlewares: RequestHandler[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  };

  private initAssets() {
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../views'));
  };

  private initErrorHandlers() {
    this.app.use('*', (req, res) => {
      res.status(404).send({
        success: false,
        message: 'Resource not found'
      })
    });
    this.app.use(errorHandler());
  }

  public async listen() {
    await appDataSource.initialize();
    this.app.listen(this.port, () => {
      console.log(`⚡️Server is listening on port ${this.port}...`);
      process.on("exit", () => {  
        appDataSource.destroy();
      })
    });
  };
};
