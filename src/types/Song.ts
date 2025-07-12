export interface TextSegment {
  id: string;
  text: string;
  alternatives: string[];
  position: number;
}

export interface Line {
  id: string;
  segments: TextSegment[];
}

export interface Section {
  id: string;
  type: 'verse' | 'chorus' | 'bridge' | 'other';
  title: string;
  lines: Line[];
}

export interface Song {
  id: string;
  title: string;
  sections: Section[];
  lastModified: Date;
}

export interface SongData {
  id: string;
  title: string;
  sections: {
    id: string;
    type: string;
    title: string;
    lines: {
      id: string;
      segments: {
        id: string;
        text: string;
        alternatives: string[];
        position: number;
      }[];
    }[];
  }[];
  lastModified: string;
}