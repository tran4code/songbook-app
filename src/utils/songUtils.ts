import { Song, Section, Line, TextSegment } from '../types/Song';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createTextSegment = (text: string, position: number): TextSegment => ({
  id: generateId(),
  text,
  alternatives: [],
  position
});

export const createLine = (text: string = ''): Line => {
  const segments = text.split(' ').map((word, index) => 
    createTextSegment(word, index)
  );
  
  return {
    id: generateId(),
    segments
  };
};

export const createSection = (type: Section['type'], title: string): Section => ({
  id: generateId(),
  type,
  title,
  lines: []
});

export const createSong = (title: string = 'My New Song'): Song => ({
  id: generateId(),
  title,
  sections: [],
  lastModified: new Date()
});

export const getInitialSong = (): Song => {
  const song = createSong('My New Song');
  
  // Create verse 1
  const verse1 = createSection('verse', 'VERSE 1');
  verse1.lines = [
    {
      id: generateId(),
      segments: [
        createTextSegment('Take', 0),
        createTextSegment('me', 1),
        createTextSegment('out', 2),
        createTextSegment('to', 3),
        createTextSegment('the', 4),
        { ...createTextSegment('field', 5), alternatives: ['meadow', 'garden', 'park'] }
      ]
    },
    {
      id: generateId(),
      segments: [
        createTextSegment('Where', 0),
        createTextSegment('the', 1),
        createTextSegment('wildflowers', 2),
        createTextSegment('grow', 3),
        { ...createTextSegment('slowly', 4), alternatives: ['quietly', 'peacefully', 'gently'] }
      ]
    },
    {
      id: generateId(),
      segments: [
        createTextSegment('And', 0),
        createTextSegment('my', 1),
        { ...createTextSegment('heart', 2), alternatives: ['soul', 'mind', 'spirit'] },
        createTextSegment('can', 3),
        createTextSegment('finally', 4),
        createTextSegment('rest', 5)
      ]
    }
  ];
  
  // Create chorus
  const chorus = createSection('chorus', 'CHORUS');
  chorus.lines = [
    {
      id: generateId(),
      segments: [
        createTextSegment('Take', 0),
        createTextSegment('me', 1),
        { ...createTextSegment('back', 2), alternatives: ['home', 'away', 'there'] },
        createTextSegment('tonight', 3)
      ]
    },
    {
      id: generateId(),
      segments: [
        createTextSegment('Where', 0),
        createTextSegment('the', 1),
        createTextSegment('stars', 2),
        createTextSegment('shine', 3),
        createTextSegment('bright', 4)
      ]
    },
    {
      id: generateId(),
      segments: [
        createTextSegment('And', 0),
        createTextSegment('everything', 1),
        createTextSegment('feels', 2),
        createTextSegment('right', 3)
      ]
    }
  ];
  
  // Create verse 2
  const verse2 = createSection('verse', 'VERSE 2');
  verse2.lines = [
    {
      id: generateId(),
      segments: [
        createTextSegment('Walking', 0),
        createTextSegment('through', 1),
        createTextSegment('the', 2),
        { ...createTextSegment('moonlight', 3), alternatives: ['darkness', 'shadows', 'starlight'] }
      ]
    },
    {
      id: generateId(),
      segments: [
        createTextSegment('Of', 0),
        createTextSegment('another', 1),
        createTextSegment('sleepless', 2),
        createTextSegment('night', 3)
      ]
    }
  ];
  
  song.sections = [verse1, chorus, verse2];
  return song;
};