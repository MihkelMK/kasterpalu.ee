import type { AlbumResponse } from '$lib/types';

import { env } from '$env/dynamic/private';
import { getRandomSearch, secureRandomInt } from '$lib/utils';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const maxTries = 10;
const batchSize = 4;

class SpotifyAPI {
  private api = SpotifyApi.withClientCredentials(env.CLIENT_ID as string, env.CLIENT_SECRET as string, []);

  async getRandomAlbum() {
    const seed = getRandomSearch();
    const randomOffset = secureRandomInt(1000);

    return await this.api.search(seed, ['album'], 'EE', 1, randomOffset).then(
      function (data) {
        if (data.albums?.items?.at(0)) {
          return data.albums.items.at(0);
        }
      },
      (err) => {
        console.log(err);
        return undefined;
      }
    );
  }

  async getAlbums(count: number): Promise<AlbumResponse[]> {
    const albums: AlbumResponse[] = [];
    const seenIds: string[] = [];
    let attemptsUsed = 0;

    while (albums.length < count && attemptsUsed < maxTries) {
      const roundSize = Math.min(batchSize, maxTries - attemptsUsed);
      attemptsUsed += roundSize;

      const results = await Promise.all(Array.from({ length: roundSize }, () => this.getRandomAlbum()));

      for (const album of results) {
        if (albums.length >= count) break;
        if (!album || seenIds.includes(album.id)) continue;

        const image = album.images.at(0);
        if (!image?.url) continue;

        seenIds.push(album.id);
        albums.push({
          name: album.name,
          artists: album.artists.map((artist) => artist.name).join(', '),
          images: album.images,
        });
      }
    }

    if (albums.length !== count) {
      throw new Error("Couldn't get albums from Spotify.");
    }

    return albums;
  }
}

export const spotifyAPI = new SpotifyAPI();
