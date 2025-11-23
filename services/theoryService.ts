import { match } from 'ts-pattern';
import { type Chord, LevelType, type Progression } from '../types';

// Simplified Key Maps for Demo Purposes (C Major and A Minor)
// In a full app, this would be algorithmic for all 12 keys.

const C_MAJOR_TRIADS: Record<string, string[]> = {
  I: ['C4', 'E4', 'G4'],
  ii: ['D4', 'F4', 'A4'],
  iii: ['E4', 'G4', 'B4'],
  IV: ['F4', 'A4', 'C5'],
  V: ['G4', 'B4', 'D5'],
  V7: ['G4', 'B4', 'D5', 'F5'],
  vi: ['A4', 'C5', 'E5'],
  'vii°': ['B4', 'D5', 'F5'],
};

const A_MINOR_TRIADS: Record<string, string[]> = {
  i: ['A3', 'C4', 'E4'],
  ii: ['B3', 'D4', 'F#4'], // Dorian ii (Minor) is same as Natural Minor ii dim? No, Dorian has F#. So ii is B D F# (Minor). Natural Minor ii is B D F (Dim). Let's define Dorian specifically.
  'ii°': ['B3', 'D4', 'F4'],
  III: ['C4', 'E4', 'G4'],
  IV: ['D4', 'F#4', 'A4'], // Dorian IV (Major)
  iv: ['D4', 'F4', 'A4'],
  v: ['E4', 'G4', 'B4'], // Natural minor
  V: ['E4', 'G#4', 'B4'], // Harmonic minor variant commonly used
  VI: ['F4', 'A4', 'C5'],
  VII: ['G4', 'B4', 'D5'],
};

// Extended C Major Map for Rock/Blues/Jazz concepts
const C_EXTENDED_TRIADS: Record<string, string[]> = {
  ...C_MAJOR_TRIADS,
  // Mixolydian / Modal Interchange (Borrowed from C Minor)
  bIII: ['Eb4', 'G4', 'Bb4'], // Eb Major
  bVI: ['Ab3', 'C4', 'Eb4'], // Ab Major
  bVII: ['Bb3', 'D4', 'F4'], // Bb Major
  // Beatles / Romantic / Chromatic
  iv: ['F4', 'Ab4', 'C5'], // Minor IV (F minor)
  'I+': ['C4', 'E4', 'G#4'], // Augmented I (C aug)
  I7: ['C4', 'E4', 'G4', 'Bb4'], // Dominant I (C7) -> pulls to IV
  // Jazz
  bII7: ['C#4', 'F4', 'G#4', 'B4'], // Db7 (Tritone Sub for G7) - Enharmonic spelling for Tone.js
};

const SECONDARY_DOMINANT_7THS: Record<string, string[]> = {
  II7: ['D4', 'F#4', 'A4', 'C5'], // D7 (V7/V)
  III7: ['E4', 'G#4', 'B4', 'D5'], // E7 (V7/vi)
  VI7: ['A4', 'C#5', 'E5', 'G5'], // A7 (V7/ii)
};

const C_TETRADS: Record<string, string[]> = {
  // Diatonic 7ths
  IM7: ['C4', 'E4', 'G4', 'B4'],
  ii7: ['D4', 'F4', 'A4', 'C5'],
  iii7: ['E4', 'G4', 'B4', 'D5'],
  IVM7: ['F4', 'A4', 'C5', 'E5'],
  V7: ['G4', 'B4', 'D5', 'F5'],
  vi7: ['A4', 'C5', 'E5', 'G5'],
  // Specific for Jazz
  bII7: ['C#4', 'F4', 'G#4', 'B4'], // Db7
};

const C_CITY_POP: Record<string, string[]> = {
  IM7: ['C4', 'E4', 'G4', 'B4'],
  IVM7: ['F4', 'A4', 'C5', 'E5'],
  III7: ['E4', 'G#4', 'B4', 'D5'], // V7/vi
  iii7: ['E4', 'G4', 'B4', 'D5'], // Diatonic iii7 (added for safety)
  vi7: ['A4', 'C5', 'E5', 'G5'],
  Gm7: ['G3', 'Bb3', 'D4', 'F4'], // Lower octave for warmth, ii/IV
  'IV/V': ['G3', 'F4', 'A4', 'C5'], // F/G - The "Tatsuro" Dominant (G11 sound)
  C7: ['C4', 'E4', 'G4', 'Bb4'], // V7/IV, typically follows Gm7
};

const getLevelConfig = (
  levelId: number,
  type: LevelType
): { key: string; map: Record<string, string[]>; pool: string[] } => {
  return match(type)
    .with(LevelType.MAJOR, () => ({
      key: 'C Major',
      map: C_MAJOR_TRIADS,
      pool: levelId === 3 ? ['I', 'IV', 'V', 'V7', 'vi'] : ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    }))
    .with(LevelType.MINOR, () => ({
      key: 'A Minor',
      map: A_MINOR_TRIADS,
      pool: ['i', 'III', 'iv', 'V', 'VI', 'VII'],
    }))
    .with(LevelType.MIXOLYDIAN, () => ({
      key: 'C Mixolydian',
      map: C_EXTENDED_TRIADS,
      pool: ['I', 'IV', 'V', 'bVII', 'vi'],
    }))
    .with(LevelType.MODAL_INTERCHANGE, () => ({
      key: 'C Major (Borrowed)',
      map: C_EXTENDED_TRIADS,
      pool: ['I', 'IV', 'V', 'bIII', 'bVI', 'bVII'],
    }))
    .with(LevelType.SECONDARY_DOMINANT, () => ({
      key: 'C Major (Sec. Dom)',
      map: { ...C_EXTENDED_TRIADS, ...SECONDARY_DOMINANT_7THS },
      pool: ['I', 'IV', 'V', 'II7', 'III7', 'VI7'],
    }))
    .with(LevelType.MINOR_PLAGAL, () => ({
      key: 'C Major (Minor iv)',
      map: C_EXTENDED_TRIADS,
      pool: ['I', 'IV', 'iv', 'V', 'vi'],
    }))
    .with(LevelType.CHROMATIC, () => ({
      key: 'C Major (Chromatic)',
      map: C_EXTENDED_TRIADS,
      pool: ['I', 'V', 'vi', 'I+', 'I7'],
    }))
    .with(LevelType.TRITONE_SUB, () => ({
      key: 'C Major (Jazz)',
      map: C_TETRADS,
      pool: ['IM7', 'ii7', 'V7', 'bII7', 'vi7'],
    }))
    .with(LevelType.DORIAN, () => ({
      key: 'A Dorian (Coltrane)',
      map: A_MINOR_TRIADS,
      pool: ['i', 'IV', 'ii', 'bVII', 'III'],
    }))
    .with(LevelType.OUDOU, () => ({
      key: 'C Major (Royal Road)',
      map: C_TETRADS,
      pool: ['IVM7', 'V7', 'iii7', 'vi7', 'IM7'],
    }))
    .with(LevelType.CITY_POP, () => ({
      key: 'C Major (Tatsuro)',
      map: C_CITY_POP,
      pool: ['IM7', 'IVM7', 'III7', 'vi7', 'Gm7', 'IV/V'],
    }))
    .exhaustive();
};

export const generateProgression = (levelId: number, type: LevelType): Progression => {
  const { key, map, pool } = getLevelConfig(levelId, type);

  // Generate 4 chords total.
  const result: Chord[] = [];

  // Determine tonic based on type
  const firstChordStr = match(type)
    .with(LevelType.MINOR, LevelType.DORIAN, () => 'i')
    .with(LevelType.OUDOU, LevelType.CITY_POP, () => 'IVM7') // City Pop often starts on IVM7 too
    .with(LevelType.TRITONE_SUB, () => 'IM7')
    .otherwise(() => 'I');

  // Special weighted logic for City Pop to create realistic "Just the Two of Us" or "Ride on Time" flows
  if (type === LevelType.CITY_POP) {
    const sequences = [
      ['IVM7', 'III7', 'vi7', 'Gm7'], // The classic JTTU run
      ['IVM7', 'IV/V', 'IM7', 'Gm7'], // Ride on Time / Sparkle vibe
      ['IVM7', 'III7', 'vi7', 'IV/V'], // Variation using Secondary Dominant III7 instead of iii7
      ['IM7', 'Gm7', 'IVM7', 'IV/V'], // Modulation prep
    ];

    // 40% chance to pick a pre-defined stylistic sequence
    if (Math.random() < 0.4) {
      const seq = sequences[Math.floor(Math.random() * sequences.length)] || sequences[0];
      const chords = (seq || []).map((roman) => ({
        roman,
        notes: map[roman] || [],
        displayName: roman,
      }));
      return {
        id: Date.now().toString(),
        key: key,
        chords,
      };
    }
    // Else fall through to random generation but with the City Pop map
  }

  const firstChordNotes = map[firstChordStr];
  if (firstChordNotes) {
    result.push({
      roman: firstChordStr,
      notes: firstChordNotes,
      displayName: `${firstChordStr} (${key})`,
    });
  }

  // Ensure we fill exactly 4 slots
  while (result.length < 4) {
    const rand = pool[Math.floor(Math.random() * pool.length)];

    if (!rand) continue;
    const notes = map[rand];
    if (!notes) continue;

    // Avoid immediate repetition for musicality (optional, but nice)
    if (result.length > 0 && result[result.length - 1]?.roman === rand && Math.random() > 0.3) {
      continue;
    }

    result.push({ roman: rand, notes: notes, displayName: rand });
  }

  return {
    id: Date.now().toString(),
    key: key,
    chords: result,
  };
};

export const getChordNotes = (roman: string, levelType: LevelType): string[] => {
  return match(levelType)
    .with(LevelType.MINOR, LevelType.DORIAN, () => A_MINOR_TRIADS[roman] || [])
    .with(LevelType.CITY_POP, () => C_CITY_POP[roman] || [])
    .with(LevelType.OUDOU, LevelType.TRITONE_SUB, () => C_TETRADS[roman] || [])
    .with(
      LevelType.SECONDARY_DOMINANT,
      () => SECONDARY_DOMINANT_7THS[roman] || C_EXTENDED_TRIADS[roman] || []
    )
    .otherwise(() => C_EXTENDED_TRIADS[roman] || []);
};
