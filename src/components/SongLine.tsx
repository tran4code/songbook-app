import React from 'react';
import { Line, TextSegment as TextSegmentType } from '../types/Song';
import TextSegment from './TextSegment';
import './SongLine.css';

interface SongLineProps {
  line: Line;
  onUpdateSegment: (lineId: string, segmentId: string, updatedSegment: TextSegmentType) => void;
}

const SongLine: React.FC<SongLineProps> = ({ line, onUpdateSegment }) => {
  const handleSegmentUpdate = (updatedSegment: TextSegmentType) => {
    onUpdateSegment(line.id, updatedSegment.id, updatedSegment);
  };

  return (
    <div className="song-line">
      {line.segments.map((segment, index) => (
        <React.Fragment key={segment.id}>
          <TextSegment
            segment={segment}
            onUpdate={handleSegmentUpdate}
          />
          {index < line.segments.length - 1 && ' '}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SongLine;