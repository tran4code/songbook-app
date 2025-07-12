import React, { useState } from 'react';
import { TextSegment as TextSegmentType, Song } from './types/Song';
import { useSongLibrary } from './hooks/useSongLibrary';
import SongSection from './components/SongSection';
import HowToUse from './components/HowToUse';
import ExportMenu from './components/ExportMenu';
import SongLibrary from './components/SongLibrary';
import FileImport from './components/FileImport';
import './App.css';

function App() {
  const [song, setSong, loadSong] = useSongLibrary();
  const [showLibrary, setShowLibrary] = useState(false);

  const handleUpdateSegment = (
    sectionId: string,
    lineId: string,
    segmentId: string,
    updatedSegment: TextSegmentType
  ) => {
    setSong(prevSong => ({
      ...prevSong,
      sections: prevSong.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lines: section.lines.map(line =>
                line.id === lineId
                  ? {
                      ...line,
                      segments: line.segments.map(segment =>
                        segment.id === segmentId ? updatedSegment : segment
                      )
                    }
                  : line
              )
            }
          : section
      ),
      lastModified: new Date()
    }));
  };

  const handleImportSong = (importedSong: Song) => {
    loadSong(importedSong);
  };

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="song-title">{song.title}</h1>
            <div className="header-actions">
              <button 
                className="library-button"
                onClick={() => setShowLibrary(true)}
              >
                Library
              </button>
              <FileImport onImportSong={handleImportSong} />
              <ExportMenu song={song} />
            </div>
          </div>
        </header>
        
        <HowToUse />
        
        <main className="song-content">
          {song.sections.map((section) => (
            <SongSection
              key={section.id}
              section={section}
              onUpdateSegment={handleUpdateSegment}
            />
          ))}
        </main>
        
        {showLibrary && (
          <SongLibrary
            onSelectSong={loadSong}
            onClose={() => setShowLibrary(false)}
            currentSongId={song.id}
          />
        )}
      </div>
    </div>
  );
}

export default App;
