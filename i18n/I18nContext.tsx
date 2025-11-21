
import React, { createContext, useContext, useState, useCallback } from 'react';
import { en } from './locales/en';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { ja } from './locales/ja';
import { TranslationSource, TxKey, Language } from './types';

const languages: Record<Language, TranslationSource> = { en, es, pt, ja };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TxKey, params?: Record<string, string | number>) => string;
  locale: TranslationSource; // Expose raw object for specific lookups
}

const I18nContext = createContext<I18nContextType | null>(null);

// Type guard for safe traversal
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TxKey, params?: Record<string, string | number>): string => {
    // Split the dot notation key
    const keys = key.split('.');
    let value: unknown = languages[language];

    for (const k of keys) {
      if (isRecord(value) && k in value) {
        value = value[k];
      } else {
        console.warn(`Missing translation key: ${key} in language: ${language}`);
        return key;
      }
    }

    let text = value as string;
    
    // Simple interpolation {{param}}
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      });
    }

    return text;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, locale: languages[language] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
