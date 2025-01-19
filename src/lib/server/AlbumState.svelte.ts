import type { AlbumSolveState } from '$lib/types';

class AlbumState {
  private albums: SpotifyApi.AlbumObjectSimplified[] | undefined = undefined;

  setAlbums(data: SpotifyApi.AlbumObjectSimplified[]) {
    if (!data) {
      return;
    }

    this.albums = data;
  }

  checkSolve(data: AlbumSolveState[]) {
    if (!data || !this.albums) {
      return false;
    }

    for (const solve of data) {
      const search = this.albums.filter((album) => album.name === solve.name);

      if (!search) {
        return false;
      }

      const matching = search.at(0);

      if (!matching) {
        return false;
      }

      if (matching.images.at(0)?.url !== solve.imageUrl) {
        return false;
      }

      for (const artistName of solve.artists) {
        if (!matching.artists.find((artist) => artist.name === artistName)) {
          return false;
        }
      }
    }

    return true;
  }
}

export const albumState = new AlbumState();
