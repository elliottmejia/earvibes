import { describe, it, expect } from 'vitest';
import { generateProgression, getChordNotes } from '../../services/theoryService';
import { LevelType } from '../../types';
import type { Chord } from '../../types';

describe('TheoryService', () => {
  describe('generateProgression', () => {
    it('should generate a progression with 4 chords', () => {
      const progression = generateProgression(1, LevelType.MAJOR);

      expect(progression).toBeDefined();
      expect(progression.chords).toHaveLength(4);
      expect(progression.id).toBeDefined();
      expect(progression.key).toBeDefined();
    });

    it('should generate different keys for multiple calls', () => {
      const keys = new Set();

      // Generate multiple progressions and collect keys
      for (let i = 0; i < 20; i++) {
        const progression = generateProgression(1, LevelType.MAJOR);
        keys.add(progression.key);
      }

      // Should have multiple different keys (not always the same)
      expect(keys.size).toBeGreaterThan(1);
    });

    it('should generate valid major key progressions', () => {
      const progression = generateProgression(1, LevelType.MAJOR);

      expect(progression.key).toMatch(/^[A-G][#b]? Major$/);

      // Check that all chords are valid major key chords
      const validMajorChords = ['I', 'ii', 'iii', 'IV', 'V', 'vi'];
      progression.chords.forEach((chord: Chord) => {
        expect(validMajorChords).toContain(chord.roman);
      });
    });

    it('should generate valid minor key progressions', () => {
      const progression = generateProgression(2, LevelType.MINOR);

      expect(progression.key).toMatch(/^[A-G][#b]? Minor$/);

      // Check that all chords are valid minor key chords
      const validMinorChords = ['i', 'III', 'iv', 'v', 'VI', 'VII'];
      progression.chords.forEach((chord: Chord) => {
        expect(validMinorChords).toContain(chord.roman);
      });
    });

    it('should generate valid Mixolydian progressions', () => {
      const progression = generateProgression(4, LevelType.MIXOLYDIAN);

      expect(progression.key).toMatch(/^[A-G][#b]? Mixolydian$/);

      // Check that all chords are valid Mixolydian chords
      const validMixolydianChords = ['I', 'IV', 'V', 'bVII', 'vi'];
      progression.chords.forEach((chord: Chord) => {
        expect(validMixolydianChords).toContain(chord.roman);
      });
    });

    it('should generate valid Dorian progressions', () => {
      const progression = generateProgression(10, LevelType.DORIAN);

      expect(progression.key).toMatch(/^[A-G][#b]? Dorian \(Coltrane\)$/);

      // Check that all chords are valid Dorian chords
      const validDorianChords = ['i', 'IV', 'ii', 'bVII', 'III'];
      progression.chords.forEach((chord: Chord) => {
        expect(validDorianChords).toContain(chord.roman);
      });
    });

    it('should start with tonic chord for most levels', () => {
      const progression = generateProgression(1, LevelType.MAJOR);
      expect(progression.chords[0]?.roman).toBe('I');
    });

    it('should start with i for minor levels', () => {
      const progression = generateProgression(2, LevelType.MINOR);
      expect(progression.chords[0]?.roman).toBe('i');
    });

    it('should generate City Pop progressions correctly', () => {
      const progression = generateProgression(12, LevelType.CITY_POP);

      expect(progression.key).toMatch(/^[A-G][#b]? Major \(Tatsuro\)$/);

      // Check that all chords are valid City Pop chords
      const validCityPopChords = ['IM7', 'IVM7', 'III7', 'vi7', 'Gm7', 'IV/V'];
      progression.chords.forEach((chord: Chord) => {
        expect(validCityPopChords).toContain(chord.roman);
      });
    });
  });

  describe('Chord Note Generation', () => {
    it('should generate correct notes for major chords', () => {
      // Test C Major chord
      const notes = getChordNotes('I', LevelType.MAJOR, 'C Major');
      expect(notes).toHaveLength(3);

      // C Major should be C-E-G (in some octave)
      const noteNames = notes.map((note: string) => note.replace(/\d/, ''));
      expect(noteNames).toContain('C');
      expect(noteNames).toContain('E');
      expect(noteNames).toContain('G');
    });

    it('should generate correct notes for minor chords', () => {
      // Test A minor chord
      const notes = getChordNotes('i', LevelType.MINOR, 'A Minor');
      expect(notes).toHaveLength(3);

      // A minor should be A-C-E (in some octave)
      const noteNames = notes.map((note: string) => note.replace(/\d/, ''));
      expect(noteNames).toContain('A');
      expect(noteNames).toContain('C');
      expect(noteNames).toContain('E');
    });

    it('should generate correct notes for 7th chords', () => {
      // Test G7 chord (V7 in C Major)
      const notes = getChordNotes('V7', LevelType.MAJOR, 'C Major');
      expect(notes).toHaveLength(4);

      // G7 should be G-B-D-F (in some octave)
      const noteNames = notes.map((note: string) => note.replace(/[#b]?\d/, ''));
      expect(noteNames).toContain('G');
      expect(noteNames).toContain('B');
      expect(noteNames).toContain('D');
      expect(noteNames).toContain('F');
    });

    it('should transpose chords correctly for different keys', () => {
      // Test I chord in different keys
      const cMajorNotes = getChordNotes('I', LevelType.MAJOR, 'C Major');
      const gMajorNotes = getChordNotes('I', LevelType.MAJOR, 'G Major');

      // Both should have 3 notes
      expect(cMajorNotes).toHaveLength(3);
      expect(gMajorNotes).toHaveLength(3);

      // Root notes should be different
      expect(cMajorNotes[0]).not.toBe(gMajorNotes[0]);

      // G Major should start with G, C Major should start with C
      expect(cMajorNotes[0]).toMatch(/^C/);
      expect(gMajorNotes[0]).toMatch(/^G/);
    });

    it('should generate correct intervals for different chord types', () => {
      // Test major triad (root, major third, perfect fifth)
      const majorNotes = getChordNotes('I', LevelType.MAJOR, 'C Major');
      const root = majorNotes[0];
      const third = majorNotes[1];
      const fifth = majorNotes[2];

      if (root && third && fifth) {
        // Extract note names and octaves for interval checking
        const rootName = root.replace(/\d/, '');
        const thirdName = third.replace(/\d/, '');
        const fifthName = fifth.replace(/\d/, '');

        // For C Major: should be C, E, G
        expect([rootName, thirdName, fifthName]).toEqual(['C', 'E', 'G']);
      }
    });

    it('should handle extended chords correctly', () => {
      // Test major 7th chord
      const maj7Notes = getChordNotes('IM7', LevelType.CITY_POP, 'C Major');
      expect(maj7Notes).toHaveLength(4);

      // CM7 should be C-E-G-B
      const noteNames = maj7Notes.map((note: string) => note.replace(/[#b]?\d/, ''));
      expect(noteNames).toContain('C');
      expect(noteNames).toContain('E');
      expect(noteNames).toContain('G');
      expect(noteNames).toContain('B');
    });

    it('should handle borrowed chords correctly', () => {
      // Test bVII chord (borrowed from minor)
      const b7Notes = getChordNotes('bVII', LevelType.MIXOLYDIAN, 'C Major');
      expect(b7Notes).toHaveLength(3);

      // In C Major, bVII should be Bb Major (Bb-D-F) or equivalent
      const noteNames = b7Notes.map((note: string) => note.replace(/\d/, ''));
      expect(noteNames).toContain('D');
      expect(noteNames).toContain('F');
      // Check for either Bb or A# (enharmonic equivalent)
      expect(noteNames.some((n) => n === 'Bb' || n === 'A#')).toBe(true);
    });

    it('should handle diminished chords correctly', () => {
      // Test diminished chord
      const dimNotes = getChordNotes('vii°', LevelType.MAJOR, 'C Major');
      expect(dimNotes).toHaveLength(3);

      // In C Major, vii° should be B diminished (B-D-F)
      const noteNames = dimNotes.map((note: string) => note.replace(/[#b]?\d/, ''));
      expect(noteNames).toContain('B');
      expect(noteNames).toContain('D');
      expect(noteNames).toContain('F');
    });

    it('should return empty array for invalid chords', () => {
      const notes = getChordNotes('INVALID', LevelType.MAJOR, 'C Major');
      expect(notes).toEqual([]);
    });

    it('should work without key parameter (backward compatibility)', () => {
      // Should not crash when key is not provided
      const notes = getChordNotes('I', LevelType.MAJOR);
      expect(Array.isArray(notes)).toBe(true);
    });
  });

  describe('Progression Musicality', () => {
    it('should avoid excessive chord repetition', () => {
      const progression = generateProgression(1, LevelType.MAJOR);

      // Count consecutive repetitions
      let consecutiveReps = 0;
      for (let i = 1; i < progression.chords.length; i++) {
        if (progression.chords[i]?.roman === progression.chords[i - 1]?.roman) {
          consecutiveReps++;
        }
      }

      // Should not have too many consecutive repetitions
      expect(consecutiveReps).toBeLessThan(2);
    });

    it('should generate chords with valid note ranges', () => {
      const progression = generateProgression(1, LevelType.MAJOR);

      progression.chords.forEach((chord: Chord) => {
        chord.notes.forEach((note: string) => {
          // Notes should be in reasonable octave range (3-6)
          const octave = parseInt(note.slice(-1), 10);
          expect(octave).toBeGreaterThanOrEqual(3);
          expect(octave).toBeLessThanOrEqual(6);

          // Note names should be valid
          const noteName = note.slice(0, -1);
          const validNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
          expect(validNotes).toContain(noteName);
        });
      });
    });

    it('should generate consistent octaves within chords', () => {
      const progression = generateProgression(1, LevelType.MAJOR);

      progression.chords.forEach((chord: Chord) => {
        if (chord.notes.length >= 2) {
          const octaves = chord.notes.map((note: string) => parseInt(note.slice(-1), 10));
          const maxOctave = Math.max(...octaves);
          const minOctave = Math.min(...octaves);

          // Octave spread within a chord should be reasonable (not more than 2 octaves)
          expect(maxOctave - minOctave).toBeLessThanOrEqual(2);
        }
      });
    });
  });

  describe('Level Type Specific Behavior', () => {
    it('should handle all level types without errors', () => {
      const levelTypes = Object.values(LevelType);

      levelTypes.forEach((type) => {
        expect(() => {
          const progression = generateProgression(1, type);
          expect(progression).toBeDefined();
          expect(progression.chords).toHaveLength(4);
        }).not.toThrow();
      });
    });

    it('should use appropriate chord pools for each level', () => {
      const majorProgression = generateProgression(1, LevelType.MAJOR);
      const minorProgression = generateProgression(2, LevelType.MINOR);

      // Major should use appropriate Roman numerals (can include lowercase for minor chords)
      const validMajorChords = ['I', 'ii', 'iii', 'IV', 'V', 'vi'];
      majorProgression.chords.forEach((chord: Chord) => {
        expect(validMajorChords).toContain(chord.roman);
      });

      // Minor should use lowercase Roman numerals for tonic
      expect(minorProgression.chords[0]?.roman).toBe('i');
    });
  });
});
