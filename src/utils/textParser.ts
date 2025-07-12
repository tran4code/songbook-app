import { Song, Section, Line, TextSegment } from '../types/Song';
import { generateId, createTextSegment } from './songUtils';

export interface ParsedSection {
  title: string;
  type: 'verse' | 'chorus' | 'bridge' | 'other';
  lines: string[];
}

export const detectSectionType = (title: string): 'verse' | 'chorus' | 'bridge' | 'other' => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('verse') || lowerTitle.match(/^v\d+/)) {
    return 'verse';
  }
  if (lowerTitle.includes('chorus') || lowerTitle.includes('refrain')) {
    return 'chorus';
  }
  if (lowerTitle.includes('bridge') || lowerTitle.includes('middle') || lowerTitle.includes('c-part')) {
    return 'bridge';
  }
  
  return 'other';
};

export const parseTextToSections = (text: string): ParsedSection[] => {
  const lines = text.split('\n').map(line => line.trim());
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  
  for (const line of lines) {
    // Skip empty lines when not in a section
    if (!line && !currentSection) continue;
    
    // Check if line is a section header (all caps, or contains common section indicators)
    const isSectionHeader = 
      /^[A-Z\s\d]+$/.test(line) && line.length > 0 && line.length < 30 ||
      /^(verse|chorus|bridge|intro|outro|pre-chorus|refrain)/i.test(line);
    
    if (isSectionHeader) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: line.toUpperCase(),
        type: detectSectionType(line),
        lines: []
      };
    } else if (currentSection) {
      // Add line to current section (including empty lines for spacing)
      currentSection.lines.push(line);
    } else if (line) {
      // If we have lyrics but no section header, create a default section
      currentSection = {
        title: 'VERSE 1',
        type: 'verse',
        lines: [line]
      };
    }
  }
  
  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
};

export const parseLineToSegments = (lineText: string): TextSegment[] => {
  if (!lineText.trim()) {
    return [];
  }
  
  // Split by spaces and create segments
  const words = lineText.split(/\s+/).filter(word => word.length > 0);
  
  return words.map((word, index) => createTextSegment(word, index));
};

export const parseSectionToLines = (section: ParsedSection): Line[] => {
  return section.lines.map(lineText => ({
    id: generateId(),
    segments: parseLineToSegments(lineText)
  }));
};

export const parseTextToSong = (text: string, title?: string): Song => {
  const lines = text.split('\n');
  const firstLine = lines[0]?.trim();
  
  // Extract title from first line if it looks like a title
  let songTitle = title || 'Untitled Song';
  let contentStartIndex = 0;
  
  if (firstLine && firstLine.length < 50 && !firstLine.includes('.') && !firstLine.includes(',')) {
    songTitle = firstLine;
    contentStartIndex = 1;
  }
  
  // Get content without title
  const content = lines.slice(contentStartIndex).join('\n');
  const parsedSections = parseTextToSections(content);
  
  // Convert to song sections
  const sections: Section[] = parsedSections.map(parsedSection => ({
    id: generateId(),
    type: parsedSection.type,
    title: parsedSection.title,
    lines: parseSectionToLines(parsedSection)
  }));
  
  return {
    id: generateId(),
    title: songTitle,
    sections,
    lastModified: new Date()
  };
};

// Helper function to read file content
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Example usage and test data
export const createSampleTextFile = (): string => {
  return `My Sample Song

VERSE 1
Walking down the lonely street
With my heart upon my sleeve
Every step I take tonight
Brings me closer to the light

CHORUS
Take me home where I belong
To the place where I am strong
In your arms I'll find my way
Home is where my heart will stay

VERSE 2
Through the darkness and the rain
I have felt this kind of pain
But I know that morning comes
And the healing has begun

CHORUS
Take me home where I belong
To the place where I am strong
In your arms I'll find my way
Home is where my heart will stay

BRIDGE
When the world gets cold and gray
And I'm lost along the way
I remember who I am
Take me home to you again`;
};