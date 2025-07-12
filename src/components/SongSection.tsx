import React from 'react';
import { Section, TextSegment as TextSegmentType } from '../types/Song';
import SongLine from './SongLine';
import './SongSection.css';

interface SongSectionProps {
  section: Section;
  onUpdateSegment: (sectionId: string, lineId: string, segmentId: string, updatedSegment: TextSegmentType) => void;
}

const SongSection: React.FC<SongSectionProps> = ({ section, onUpdateSegment }) => {
  const handleSegmentUpdate = (lineId: string, segmentId: string, updatedSegment: TextSegmentType) => {
    onUpdateSegment(section.id, lineId, segmentId, updatedSegment);
  };

  return (
    <div className="song-section">
      <h3 className="section-title">{section.title}</h3>
      <div className="section-lines">
        {section.lines.map((line) => (
          <SongLine
            key={line.id}
            line={line}
            onUpdateSegment={handleSegmentUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default SongSection;