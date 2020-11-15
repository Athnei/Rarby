import moment from "moment";
import { ScrapeTorrents } from "../app";
import { Torrents } from "../models/torrents";
import { LoadLastTorrent, SaveTorrents } from "./db_service";

export async function GetTorrents(): Promise<Torrents> {

    const lastTorr: Torrents = await LoadLastTorrent();

    if (!lastTorr) {
        const tors: Torrents = await ScrapeTorrents();

        return await SaveTorrents(tors);        
    }

    if (moment(lastTorr?.dateOfScraping).isBefore(moment().subtract(1, 'h'))) {
        const tors: Torrents = await ScrapeTorrents();

        return await SaveTorrents(tors);
    } else {
        return lastTorr
    }
}