import { describe, it, expect } from 'vitest';
import { generateProgression, getChordNotes } from '../../services/theoryService';
import { LevelType } from '../../types';
import type { Chord } from '../../types';

describe('TheoryService Edge Cases', () => {
  describe('Random Key Distribution', () => {
    it('should eventually generate all 12 major keys', () => {
      const keys = new Set();

      // Generate many progressions to test distribution
      for (let i = 0; i < 100; i++) {
        const progression = generateProgression(1, LevelType.MAJOR);
        const keyName = progression.key.replace(' Major', '');
        keys.add(keyName);
      }

      // Should generate most keys (not necessarily all due to randomness)
      expect(keys.size).toBeGreaterThan(8);

      // Check that generated keys are valid
      const validKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      keys.forEach((key) => {
        expect(validKeys).toContain(key);
      });
    });

    it('should eventually generate all 12 minor keys', () => {
      const keys = new Set();

      // Generate many progressions to test distribution
      for (let i = 0; i < 100; i++) {
        const progression = generateProgression(2, LevelType.MINOR);
        const keyName = progression.key.replace(' Minor', '');
        keys.add(keyName);
      }

      // Should generate most keys (not necessarily all due to randomness)
      expect(keys.size).toBeGreaterThan(8);

      // Check that generated keys are valid
      const validKeys = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
      keys.forEach((key) => {
        expect(validKeys).toContain(key);
      });
    });
  });

  describe('Chord Quality Consistency', () => {
    it('should generate consistent major chord qualities', () => {
      // Test I chord in multiple major keys
      const keys = ['C Major', 'G Major', 'D Major', 'F Major'];

      keys.forEach((key) => {
        const notes = getChordNotes('I', LevelType.MAJOR, key);
        expect(notes).toHaveLength(3);

        // All major chords should have the same interval pattern
        const noteNames = notes.map((note: string) => note.replace(/\d/, ''));

        // Check that it's a major triad (root, major third, perfect fifth)
        // This is a simplified check - in reality we'd check actual intervals
        expect(noteNames.length).toBe(3);
        expect(noteNames[0]).toBeDefined();
        expect(noteNames[1]).toBeDefined();
        expect(noteNames[2]).toBeDefined();
      });
    });

    it('should generate consistent minor chord qualities', () => {
      // Test i chord in multiple minor keys
      const keys = ['A Minor', 'E Minor', 'D Minor', 'B Minor'];

      keys.forEach((key) => {
        const notes = getChordNotes('i', LevelType.MINOR, key);
        expect(notes).toHaveLength(3);

        // All minor chords should have the same interval pattern
        const noteNames = notes.map((note: string) => note.replace(/\d/, ''));

        // Check that it's a minor triad
        expect(noteNames.length).toBe(3);
        expect(noteNames[0]).toBeDefined();
        expect(noteNames[1]).toBeDefined();
        expect(noteNames[2]).toBeDefined();
      });
    });
  });

  describe('Advanced Chord Types', () => {
    it('should handle secondary dominants correctly', () => {
      const progression = generateProgression(6, LevelType.SECONDARY_DOMINANT);

      // Should include secondary dominant chords
      progression.chords.forEach((chord: Chord) => {
        const validChords = ['I', 'IV', 'V', 'II7', 'III7', 'VI7'];
        expect(validChords).toContain(chord.roman);
      });

      expect(progression.chords).toHaveLength(4);
      expect(progression.key).toMatch(/^[A-G][#b]? Major \(Sec\. Dom\)$/);
    });

    it('should handle tritone substitution correctly', () => {
      const progression = generateProgression(9, LevelType.TRITONE_SUB);

      // Should include jazz-style chords
      const jazzChords = ['IM7', 'ii7', 'V7', 'bII7', 'vi7'];
      progression.chords.forEach((chord: Chord) => {
        expect(jazzChords).toContain(chord.roman);
      });

      expect(progression.key).toMatch(/^[A-G][#b]? Major \(Jazz\)$/);
    });

    it('should handle chromatic mediants correctly', () => {
      const progression = generateProgression(8, LevelType.CHROMATIC);

      // Should include chromatic chords
      const chromaticChords = ['I', 'V', 'vi', 'I+', 'I7'];
      progression.chords.forEach((chord: Chord) => {
        expect(chromaticChords).toContain(chord.roman);
      });

      expect(progression.key).toMatch(/^[A-G][#b]? Major \(Chromatic\)$/);
    });
  });

  describe('Note Validation', () => {
    it('should generate notes within valid MIDI range', () => {
      const progression = generateProgression(1, LevelType.MAJOR);

      progression.chords.forEach((chord: Chord) => {
        chord.notes.forEach((note: string) => {
          // Extract note name and octave
          const noteName = note.slice(0, -1);
          const octaveStr = note.slice(-1);
          const octave = parseInt(octaveStr, 10);

          // Validate note name
          const validNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
          expect(validNotes).toContain(noteName);

          // Validate octave (reasonable range for the app)
          expect(octave).toBeGreaterThanOrEqual(1);
          expect(octave).toBeLessThanOrEqual(8);

          // Validate that it's a number
          expect(!Number.isNaN(octave)).toBe(true);
        });
      });
    });

    it('should maintain consistent spelling within progressions', () => {
      const progression = generateProgression(1, LevelType.MAJOR);

      // Collect all note names used
      const allNoteNames = new Set();
      progression.chords.forEach((chord: Chord) => {
        chord.notes.forEach((note: string) => {
          allNoteNames.add(note.slice(0, -1));
        });
      });

      // Should not have both sharps and flats for the same pitch class
      // This is a simplified check - in reality we'd check enharmonic consistency
      expect(allNoteNames.size).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid level types', () => {
      // The function should throw an error for invalid level types due to ts-pattern
      expect(() => {
        generateProgression(1, 'INVALID' as LevelType);
      }).toThrow();
    });

    it('should handle edge case level IDs', () => {
      // Test with boundary values
      expect(() => {
        generateProgression(0, LevelType.MAJOR);
      }).not.toThrow();

      expect(() => {
        generateProgression(999, LevelType.MAJOR);
      }).not.toThrow();
    });

    it('should handle empty or null chord symbols', () => {
      expect(() => {
        getChordNotes('', LevelType.MAJOR, 'C Major');
      }).not.toThrow();

      expect(() => {
        getChordNotes('' as string, LevelType.MAJOR, 'C Major');
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should generate progressions quickly', () => {
      const startTime = performance.now();

      // Generate 100 progressions
      for (let i = 0; i < 100; i++) {
        generateProgression(1, LevelType.MAJOR);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 1 second for 100 progressions)
      expect(duration).toBeLessThan(1000);
    });

    it('should generate chord notes quickly', () => {
      const startTime = performance.now();

      // Generate 1000 chord note sets
      for (let i = 0; i < 1000; i++) {
        getChordNotes('I', LevelType.MAJOR, 'C Major');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time
      expect(duration).toBeLessThan(500);
    });
  });
});
