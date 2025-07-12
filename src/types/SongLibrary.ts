export interface SongMetadata {
  id: string;
  title: string;
  lastModified: Date;
  dateCreated: Date;
}

export interface SongLibrary {
  songs: SongMetadata[];
  currentSongId: string | null;
}

export interface SongLibraryData {
  songs: {
    id: string;
    title: string;
    lastModified: string;
    dateCreated: string;
  }[];
  currentSongId: string | null;
}