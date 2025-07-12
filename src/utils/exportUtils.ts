import { Song } from '../types/Song';

export const exportSongAsText = (song: Song): string => {
  let output = `${song.title}\n${'='.repeat(song.title.length)}\n\n`;
  
  song.sections.forEach((section, sectionIndex) => {
    output += `${section.title}\n`;
    
    section.lines.forEach((line, lineIndex) => {
      const lineText = line.segments.map(segment => segment.text).join(' ');
      output += `${lineText}\n`;
    });
    
    if (sectionIndex < song.sections.length - 1) {
      output += '\n';
    }
  });
  
  return output;
};

export const exportSongWithAlternatives = (song: Song): string => {
  let output = `${song.title}\n${'='.repeat(song.title.length)}\n\n`;
  
  song.sections.forEach((section, sectionIndex) => {
    output += `${section.title}\n`;
    
    section.lines.forEach((line, lineIndex) => {
      const lineText = line.segments.map(segment => {
        if (segment.alternatives.length > 0) {
          return `${segment.text}[${segment.alternatives.join('|')}]`;
        }
        return segment.text;
      }).join(' ');
      output += `${lineText}\n`;
    });
    
    if (sectionIndex < song.sections.length - 1) {
      output += '\n';
    }
  });
  
  return output;
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};