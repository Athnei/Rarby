import express, { Application } from 'express';
import moment from 'moment';
import { GetTorrents } from './app';
import { Torrents } from './models/torrents';
import { LoadLastTorrent, LoadTorrents, SetTorrentsToDb } from './services/db_service';

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

      let lastTorr: Torrents = await LoadLastTorrent();

      if (moment(lastTorr.dateOfScraping).isBefore(moment().subtract(1, 'h'))) {
        const tors: Torrents = await GetTorrents();

        lastTorr = await SetTorrentsToDb(tors);
      }

      console.log('Torrents Loaded');

      res.json(lastTorr);
    });

    this.express.use('/', router);
  }
}

export default new Express().express