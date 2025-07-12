import { useState, useEffect } from 'react';
import { Song, SongData } from '../types/Song';

const STORAGE_KEY = 'songbook-song';

export const useLocalStorage = (initialSong: Song) => {
  const [song, setSong] = useState<Song>(initialSong);

  // Load song from localStorage on mount
  useEffect(() => {
    try {
      const savedSongData = localStorage.getItem(STORAGE_KEY);
      if (savedSongData) {
        const parsedData: SongData = JSON.parse(savedSongData);
        const loadedSong: Song = {
          ...parsedData,
          lastModified: new Date(parsedData.lastModified),
          sections: parsedData.sections.map(section => ({
            ...section,
            type: section.type as 'verse' | 'chorus' | 'bridge' | 'other'
          }))
        };
        setSong(loadedSong);
      }
    } catch (error) {
      console.error('Error loading song from localStorage:', error);
    }
  }, []);

  // Save song to localStorage whenever it changes
  useEffect(() => {
    try {
      const songData: SongData = {
        ...song,
        lastModified: song.lastModified.toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songData));
    } catch (error) {
      console.error('Error saving song to localStorage:', error);
    }
  }, [song]);

  return [song, setSong] as const;
};