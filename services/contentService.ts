
import { LevelType, LevelId } from '../types';
import { TxKey, TranslationSource } from '../i18n/types';

export const fetchTheoryLesson = async (levelId: LevelId, t: (key: TxKey) => string): Promise<string> => {
  // Simulate network delay for effect
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Construct the key dynamically, ensuring it matches the Lesson structure
  // With LevelId = 1|2|3, this template literal produces "lessons.1" | "lessons.2" | "lessons.3"
  // which are valid TxKey paths.
  const key = `lessons.${levelId}` as const;
  
  const content = t(key);
  
  // Fallback check if the key returned itself (meaning missing translation)
  if (content === key) {
    return `## ${t('theory.notFound')}\n\n${t('theory.notFoundDesc')}`;
  }
  
  return content;
};

export const fetchFeedback = async (
  correctProgression: readonly string[], 
  userGuess: string[], 
  levelType: LevelType,
  t: (key: TxKey, params?: any) => string,
  localeData: TranslationSource
): Promise<string> => {
  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 300));

  // 1. Find the first error to focus on
  let errorIndex = -1;
  for (let i = 0; i < correctProgression.length; i++) {
    if (correctProgression[i] !== userGuess[i]) {
      errorIndex = i;
      break;
    }
  }

  if (errorIndex === -1) {
    return t('feedback.perfect');
  }

  const correctChord = correctProgression[errorIndex];
  const userChord = userGuess[errorIndex];
  
  // Lookup chord descriptions safely
  const typeKey = (levelType === LevelType.MIXOLYDIAN) ? 'MAJOR' : levelType; 
  const descs = localeData.chordDescriptions[typeKey] || {};
  
  // Use type narrowing or 'as' if keys aren't perfectly aligned, but here they should be strings.
  // We can use a simple object access since we are in dynamic territory, 
  // but strict typing would require ensuring correctChord is a keyof descs.
  // Given chords are dynamic strings, we check existence.
  
  const correctDesc = (correctChord in descs) ? (descs as Record<string, string>)[correctChord] : t('feedback.defaultCorrect');
  const userDesc = (userChord in descs) ? (descs as Record<string, string>)[userChord] : t('feedback.defaultIncorrect');

  // 2. Dynamic Feedback Construction
  const intro = t('feedback.close', { index: errorIndex + 1 });
  
  const comparison = t('feedback.comparison', {
    user: userChord,
    userDesc: userDesc,
    correct: correctChord,
    correctDesc: correctDesc
  });

  const tip = t('feedback.tip', { user: userChord, correct: correctChord });

  return intro + comparison + tip;
};
