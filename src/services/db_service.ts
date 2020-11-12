const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
import { Torrents } from '../models/torrents';

let db: any;

export async function run() {
    db = await low(new FileSync('db.json'));
    db.defaults({ posts: [] })
        .write();
}

export async function LoadTorrents(): Promise<Torrents[]> {

    const result = await db.get('posts')
        .value();

    return result;
}

export async function LoadLastTorrent(): Promise<Torrents> {
    return await db.get('posts').value().pop();
}

export async function SetTorrentsToDb(t: Torrents): Promise<Torrents> {
    if (!t) return Promise.reject();

    return await db.get('posts')
        .push(t)
        .write();
}

run();