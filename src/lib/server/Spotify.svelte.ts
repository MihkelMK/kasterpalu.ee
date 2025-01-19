import SpotifyWebApi from 'spotify-web-api-node';
import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import { getRandomSearch } from '$lib/utils';

class SpotifyAPI {
  private api = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  });
  private exiresAt: Date = $state(new Date());

  async refreshAccessToken() {
    // If current token is valid for at least 100ms more
    if (this.exiresAt.getTime() - new Date().getTime() > 10) {
      return true;
    }

    return await this.api.clientCredentialsGrant().then(
      (data) => {
        console.log(data.body);
        if (!data.body['expires_in'] || !data.body['access_token']) {
          return false;
        }

        const new_date = new Date();
        new_date.setSeconds(new_date.getSeconds() + Number(data.body['expires_in']));

        this.exiresAt = new_date;
        this.api.setAccessToken(data.body['access_token']);

        return true;
      },
      function (err) {
        console.log('Something went wrong when retrieving an access token', err);
        return false;
      }
    );
  }

  async getRandomAlbum() {
    if (!(await this.refreshAccessToken())) {
      return undefined;
    }

    const randomSearch = getRandomSearch();
    const randomOffset = Math.floor(Math.random() * 1000);

    return await this.api.search(randomSearch, ['album'], { limit: 1, offset: randomOffset }).then(
      function (data) {
        if (data.body.albums?.items?.at(0)) {
          return data.body.albums.items.at(0);
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
