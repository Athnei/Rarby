import path from 'path';
import express, { Application, Request, Response, NextFunction } from 'express';
import { GetTorrents } from './app';

class Express {

  public express: Application;

  constructor() {
    this.express = express();

    this.express.set('views', path.join(__dirname, '../views'));
    this.express.set('view engine', 'pug');
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    router.get('/', async (req, res) => {
      console.log('Loading Torrents');

      const tor = await GetTorrents();

      console.log('Torrents Loaded');

      res.render('index', { torrents: tor })
    });

    this.express.use('/', router);
  }
  // app.use(express.static('src/public'));
}

export default new Express().express