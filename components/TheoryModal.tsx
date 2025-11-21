import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './Button';
import { useTranslation } from '../i18n/I18nContext';

interface Props {
  content: string;
  onStart: () => void;
  onBack?: () => void;
  isLoading: boolean;
}

export const TheoryModal: React.FC<Props> = ({ content, onStart, onBack, isLoading }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">
        
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{t('theory.title')}</h2>
          {onBack && (
            <button 
              onClick={onBack}
              className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-colors"
              aria-label={t('common.back')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 prose prose-invert prose-indigo max-w-none">
          {isLoading ? (
             <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-slate-700 rounded w-3/4"></div>
               <div className="h-4 bg-slate-700 rounded w-1/2"></div>
               <div className="h-32 bg-slate-700 rounded w-full"></div>
               <div className="h-4 bg-slate-700 rounded w-5/6"></div>
             </div>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-2xl flex justify-end gap-3">
          {onBack && (
            <Button onClick={onBack} variant="ghost">
               {t('common.back')}
            </Button>
          )}
          <Button onClick={onStart} disabled={isLoading} className="min-w-[150px]">
            {isLoading ? t('theory.generating') : t('theory.startQuiz')}
          </Button>
        </div>
      </div>
    </div>
  );
};