import express, { Application } from 'express';
import { GetTorrents } from './app';
import { Torrents } from './models/torrents';
import { GetTorrentsFromDb, SetTorrentsToDb } from './services/db_service';

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

      const tors = await GetTorrents();

      // SetTorrentsToDb(tors as Torrents);

      const tor = await GetTorrentsFromDb();

      console.log('Torrents Loaded');

      res.json(tor);
    });

    this.express.use('/', router);
  }
}

export default new Express().express