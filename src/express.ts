import express, { Application } from 'express';
import { GetTorrents } from './app';

class Express {

  public express: Application;

  constructor() {
    this.express = express();

    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    router.get('/', async (req, res) => {
      console.log('Loading Torrents');

      const tor = await GetTorrents();

      console.log('Torrents Loaded');

      res.json(tor);
    });

    this.express.use('/', router);
  }
}

export default new Express().express