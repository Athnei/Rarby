const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
import { Torrents } from '../models/torrents';

let db: any;

export async function run() {
    db = await low(new FileSync('db.json'));
    db.defaults({ posts: [] })
        .write();
}

export function GetTorrentsFromDb() {

    const result = db.get('posts')        
        .value();

    return result;
}

export async function SetTorrentsToDb(t: Torrents) {
    if (!t) return;

    await db.get('posts')
        .push(t)
        .write();
}

run();