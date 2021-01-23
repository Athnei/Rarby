const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
import { Torrents } from '../models/torrents';

let db: any;

export async function run() {

    db = await low(new FileSync('db.json'));
    db.defaults({ posts: [] })
        .write();
}

export async function LoadAllTorrents(): Promise<Torrents[]> {

    const result = await db.get('posts')
        .value();

    return result;
}

export async function LoadLastTorrent(): Promise<Torrents> {

    if (db.has('posts').value()) {
        return await db.get('posts').orderBy('dateOfScraping', 'desc').first().value();
    }

    return Promise.reject(null);
}

export async function SaveTorrents(t: Torrents): Promise<Torrents> {
    
    if (!t) return Promise.reject();

    if (db.get('posts').size().value() >= 10) {
        const last: Torrents = await db.get('posts')
            .orderBy('dateOfScraping', 'desc')
            .last()
            .value();

        db.remove({ Id: last.Id })
            .write()
    }

    await db.get('posts')
        .push(t)
        .write();

    return t;

}

run();