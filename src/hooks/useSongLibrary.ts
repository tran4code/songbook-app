import { useState, useEffect } from 'react';
import { Song } from '../types/Song';
import { getCurrentSong, saveSongToLibrary, setCurrentSong } from '../utils/songLibraryUtils';
import { getInitialSong } from '../utils/songUtils';

export const useSongLibrary = () => {
  const [song, setSong] = useState<Song>(() => getCurrentSong() || getInitialSong());

  // Save song whenever it changes
  useEffect(() => {
    saveSongToLibrary(song);
    setCurrentSong(song.id);
  }, [song]);

  const loadSong = (newSong: Song) => {
    setSong(newSong);
  };

  return [song, setSong, loadSong] as const;
};