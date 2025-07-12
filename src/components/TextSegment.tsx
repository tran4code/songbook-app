import React, { useState, useRef, useEffect } from 'react';
import { TextSegment as TextSegmentType } from '../types/Song';
import './TextSegment.css';

interface TextSegmentProps {
  segment: TextSegmentType;
  onUpdate: (updatedSegment: TextSegmentType) => void;
}

const TextSegment: React.FC<TextSegmentProps> = ({ segment, onUpdate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAlternative, setNewAlternative] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasAlternatives = segment.alternatives.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsEditing(false);
        setNewAlternative('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSegmentClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAlternativeSelect = (text: string) => {
    const updatedSegment = { ...segment, text };
    onUpdate(updatedSegment);
    setIsDropdownOpen(false);
  };

  const handleAddAlternative = () => {
    if (newAlternative.trim() && !segment.alternatives.includes(newAlternative.trim())) {
      const updatedSegment = {
        ...segment,
        alternatives: [...segment.alternatives, newAlternative.trim()]
      };
      onUpdate(updatedSegment);
    }
    setNewAlternative('');
    setIsEditing(false);
    setIsDropdownOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddAlternative();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewAlternative('');
    }
  };

  const handleDeleteAlternative = (altToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedAlternatives = segment.alternatives.filter(alt => alt !== altToDelete);
    const updatedSegment = { ...segment, alternatives: updatedAlternatives };
    onUpdate(updatedSegment);
  };

  return (
    <span className="text-segment-container" ref={dropdownRef}>
      <span
        className={`text-segment ${hasAlternatives ? 'has-alternatives' : ''}`}
        onClick={handleSegmentClick}
      >
        {segment.text}
      </span>
      
      {isDropdownOpen && (
        <div className="alternatives-dropdown">
          <div className="current-option">
            <span className="option-text">{segment.text}</span>
            <span className="current-label">(current)</span>
          </div>
          
          {segment.alternatives.map((alternative, index) => (
            <div
              key={index}
              className="alternative-option"
              onClick={() => handleAlternativeSelect(alternative)}
            >
              <span className="option-text">{alternative}</span>
              <button
                className="delete-button"
                onClick={(e) => handleDeleteAlternative(alternative, e)}
                title="Delete alternative"
              >
                ×
              </button>
            </div>
          ))}
          
          {isEditing ? (
            <div className="add-alternative-input">
              <input
                ref={inputRef}
                type="text"
                value={newAlternative}
                onChange={(e) => setNewAlternative(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type new alternative..."
                className="alternative-input"
              />
              <button
                onClick={handleAddAlternative}
                className="confirm-button"
                disabled={!newAlternative.trim()}
              >
                ✓
              </button>
            </div>
          ) : (
            <div
              className="add-alternative-button"
              onClick={() => setIsEditing(true)}
            >
              + Add alternative
            </div>
          )}
        </div>
      )}
    </span>
  );
};

export default TextSegment;