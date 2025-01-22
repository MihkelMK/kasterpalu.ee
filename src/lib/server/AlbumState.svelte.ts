import type { AlbumData, AlbumSolveState } from '$lib/types';

class AlbumState {
  private albums: AlbumSolveState[] | undefined = undefined;

  setAlbums(data: AlbumSolveState[]) {
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

      if (matching.image !== solve.image) {
        return false;
      }

      if (matching.artists !== solve.artists) {
        return false;
      }
    }

    return true;
  }
}

export const albumState = new AlbumState();
