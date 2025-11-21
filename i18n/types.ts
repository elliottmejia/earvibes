import { en } from './locales/en';

type RecursiveTranslation<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveTranslation<T[K]> : string;
};

export type TranslationSource = RecursiveTranslation<typeof en>;

// Recursive helper to generate dot-notation keys (e.g. "home.title")
export type TxKeyPath<T> = T extends object 
  ? { [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${TxKeyPath<T[K]>}`}` }[keyof T] 
  : never;

export type TxKey = TxKeyPath<typeof en>;

export type Language = 'en' | 'es' | 'pt' | 'ja';