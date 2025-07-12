import React, { useRef } from 'react';
import { Song } from '../types/Song';
import { parseTextToSong, readFileAsText } from '../utils/textParser';
import './FileImport.css';

interface FileImportProps {
  onImportSong: (song: Song) => void;
}

const FileImport: React.FC<FileImportProps> = ({ onImportSong }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileAsText(file);
      const song = parseTextToSong(content, file.name.replace(/\.[^/.]+$/, ''));
      onImportSong(song);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Error reading file. Please make sure it\'s a valid text file.');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-import">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        className="import-button"
        onClick={handleButtonClick}
      >
        Import Text File
      </button>
    </div>
  );
};

export default FileImport;