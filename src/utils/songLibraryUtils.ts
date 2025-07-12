import { Song, SongData } from '../types/Song';
import { SongLibrary, SongLibraryData, SongMetadata } from '../types/SongLibrary';

const LIBRARY_KEY = 'songbook-library';
const SONG_PREFIX = 'songbook-song-';

export const saveSongToLibrary = (song: Song): void => {
  try {
    // Save the song data
    const songData: SongData = {
      ...song,
      lastModified: song.lastModified.toISOString()
    };
    localStorage.setItem(`${SONG_PREFIX}${song.id}`, JSON.stringify(songData));
    
    // Update library index
    const library = getLibrary();
    const existingIndex = library.songs.findIndex(s => s.id === song.id);
    
    const metadata: SongMetadata = {
      id: song.id,
      title: song.title,
      lastModified: song.lastModified,
      dateCreated: existingIndex >= 0 ? library.songs[existingIndex].dateCreated : new Date()
    };
    
    if (existingIndex >= 0) {
      library.songs[existingIndex] = metadata;
    } else {
      library.songs.push(metadata);
    }
    
    saveLibrary(library);
  } catch (error) {
    console.error('Error saving song to library:', error);
  }
};

export const loadSongFromLibrary = (songId: string): Song | null => {
  try {
    const songDataString = localStorage.getItem(`${SONG_PREFIX}${songId}`);
    if (!songDataString) return null;
    
    const songData: SongData = JSON.parse(songDataString);
    const song: Song = {
      ...songData,
      lastModified: new Date(songData.lastModified),
      sections: songData.sections.map(section => ({
        ...section,
        type: section.type as 'verse' | 'chorus' | 'bridge' | 'other'
      }))
    };
    
    return song;
  } catch (error) {
    console.error('Error loading song from library:', error);
    return null;
  }
};

export const deleteSongFromLibrary = (songId: string): void => {
  try {
    // Remove song data
    localStorage.removeItem(`${SONG_PREFIX}${songId}`);
    
    // Update library index
    const library = getLibrary();
    library.songs = library.songs.filter(s => s.id !== songId);
    
    // If this was the current song, clear the current song
    if (library.currentSongId === songId) {
      library.currentSongId = null;
    }
    
    saveLibrary(library);
  } catch (error) {
    console.error('Error deleting song from library:', error);
  }
};

export const getLibrary = (): SongLibrary => {
  try {
    const libraryDataString = localStorage.getItem(LIBRARY_KEY);
    if (!libraryDataString) {
      return { songs: [], currentSongId: null };
    }
    
    const libraryData: SongLibraryData = JSON.parse(libraryDataString);
    return {
      songs: libraryData.songs.map(song => ({
        ...song,
        lastModified: new Date(song.lastModified),
        dateCreated: new Date(song.dateCreated)
      })),
      currentSongId: libraryData.currentSongId
    };
  } catch (error) {
    console.error('Error loading library:', error);
    return { songs: [], currentSongId: null };
  }
};

export const saveLibrary = (library: SongLibrary): void => {
  try {
    const libraryData: SongLibraryData = {
      songs: library.songs.map(song => ({
        ...song,
        lastModified: song.lastModified.toISOString(),
        dateCreated: song.dateCreated.toISOString()
      })),
      currentSongId: library.currentSongId
    };
    
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(libraryData));
  } catch (error) {
    console.error('Error saving library:', error);
  }
};

export const setCurrentSong = (songId: string): void => {
  const library = getLibrary();
  library.currentSongId = songId;
  saveLibrary(library);
};

export const getCurrentSong = (): Song | null => {
  const library = getLibrary();
  if (!library.currentSongId) return null;
  
  return loadSongFromLibrary(library.currentSongId);
};

export const getSongList = (): SongMetadata[] => {
  const library = getLibrary();
  return library.songs.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
};