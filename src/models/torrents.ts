import { Item } from './carousel-item';

export interface Torrents {
    Id: string;
    torrentItems: Item[];
    dateOfScraping: Date;
}