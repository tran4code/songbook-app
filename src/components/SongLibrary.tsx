import React, { useState, useEffect } from 'react';
import { Song } from '../types/Song';
import { SongMetadata } from '../types/SongLibrary';
import { getSongList, deleteSongFromLibrary, setCurrentSong, loadSongFromLibrary } from '../utils/songLibraryUtils';
import { createSong } from '../utils/songUtils';
import './SongLibrary.css';

interface SongLibraryProps {
  onSelectSong: (song: Song) => void;
  onClose: () => void;
  currentSongId?: string;
}

const SongLibrary: React.FC<SongLibraryProps> = ({ onSelectSong, onClose, currentSongId }) => {
  const [songs, setSongs] = useState<SongMetadata[]>([]);

  useEffect(() => {
    setSongs(getSongList());
  }, []);

  const handleSelectSong = (songMetadata: SongMetadata) => {
    const song = loadSongFromLibrary(songMetadata.id);
    if (song) {
      setCurrentSong(song.id);
      onSelectSong(song);
      onClose();
    }
  };

  const handleDeleteSong = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this song?')) {
      deleteSongFromLibrary(songId);
      setSongs(getSongList());
    }
  };

  const handleNewSong = () => {
    const newSong = createSong();
    onSelectSong(newSong);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="song-library-overlay">
      <div className="song-library">
        <div className="library-header">
          <h2>Song Library</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="library-actions">
          <button className="new-song-button" onClick={handleNewSong}>
            + New Song
          </button>
        </div>

        <div className="songs-list">
          {songs.length === 0 ? (
            <div className="empty-library">
              <p>No songs yet. Create your first song!</p>
            </div>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                className={`song-item ${currentSongId === song.id ? 'current' : ''}`}
                onClick={() => handleSelectSong(song)}
              >
                <div className="song-info">
                  <h3 className="song-title">{song.title}</h3>
                  <p className="song-date">
                    Modified: {formatDate(song.lastModified)}
                  </p>
                </div>
                <button
                  className="delete-song-button"
                  onClick={(e) => handleDeleteSong(song.id, e)}
                  title="Delete song"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SongLibrary;