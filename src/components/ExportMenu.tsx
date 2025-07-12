import React, { useState } from 'react';
import { Song } from '../types/Song';
import { exportSongAsText, exportSongWithAlternatives, downloadFile } from '../utils/exportUtils';
import './ExportMenu.css';

interface ExportMenuProps {
  song: Song;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ song }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportPlainText = () => {
    const content = exportSongAsText(song);
    const filename = `${song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    downloadFile(content, filename);
    setIsOpen(false);
  };

  const handleExportWithAlternatives = () => {
    const content = exportSongWithAlternatives(song);
    const filename = `${song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_with_alternatives.txt`;
    downloadFile(content, filename);
    setIsOpen(false);
  };

  return (
    <div className="export-menu">
      <button
        className="export-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Export
      </button>
      
      {isOpen && (
        <div className="export-dropdown">
          <button
            className="export-option"
            onClick={handleExportPlainText}
          >
            Export as Plain Text
          </button>
          <button
            className="export-option"
            onClick={handleExportWithAlternatives}
          >
            Export with Alternatives
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;