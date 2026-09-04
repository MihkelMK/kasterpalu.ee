import { env } from '$env/dynamic/private';
import { getRandomSearch, secureRandomInt } from '$lib/utils';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

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
}

export const spotifyAPI = new SpotifyAPI();
