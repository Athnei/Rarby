import express, { Application } from 'express';
import { Torrents } from './models/torrents';
import { GetTorrents } from './services/torrent_service';

class Express {

  public express: Application;

  constructor() {
    this.express = express();

    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    router.get('/', async (req, res) => {
      
      console.log("Receiving request")

      const torrents: Torrents = await GetTorrents();

      if (!torrents) {
        res.json({ Error: "GetTorrents returned null" });
      }

      console.log("Sending response")

      res.json({ date: new Date(), torrents });
    });

    this.express.use('/', router);
  }
}

export default new Express().express