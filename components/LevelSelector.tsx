
import React from 'react';
import { LEVELS, REAL_SONGS } from '../constants';
import { LevelConfig, RealSong } from '../types';
import { Button } from './Button';
import { useTranslation } from '../i18n/I18nContext';

interface Props {
  onSelectLevel: (level: LevelConfig) => void;
  onSelectRealSong: (song: RealSong) => void;
}

export const LevelSelector: React.FC<Props> = ({ onSelectLevel, onSelectRealSong }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto p-6 w-full">
      
      {/* Synthetic Levels */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          {t('home.selectDifficulty')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level) => {
            const titleKey = `levelTitles.${level.id}` as const;
            const descKey = `levelDescs.${level.id}` as const;

            return (
              <div key={level.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-indigo-400 text-sm font-mono font-bold tracking-wider">
                    {t('home.levelLabel', { id: level.id })}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">
                  {t(titleKey)}
                </h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow">
                  {t(descKey)}
                </p>
                <Button onClick={() => onSelectLevel(level)} fullWidth className="mt-auto">
                  {t('home.startTraining')}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real Songs Section */}
      <div className="mb-8">
         <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-slate-700 flex-grow max-w-[100px]"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">New</span>
                {t('home.realSongsTitle')}
            </h2>
            <div className="h-px bg-slate-700 flex-grow max-w-[100px]"></div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {REAL_SONGS.map((song) => (
                <div key={song.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-red-500/50 transition-all group flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative h-48 md:h-auto bg-black">
                         <img 
                            src={`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`} 
                            alt={song.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                            </div>
                         </div>
                    </div>
                    <div className="p-5 flex flex-col justify-center md:w-3/5">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl font-bold text-white">{song.title}</h3>
                             <span className="text-[10px] font-mono border border-slate-600 px-1.5 py-0.5 rounded text-slate-400">{song.key}</span>
                        </div>
                        <p className="text-indigo-400 text-sm font-medium mb-4">{song.artist}</p>
                        <Button 
                            onClick={() => onSelectRealSong(song)} 
                            variant="secondary" 
                            className="mt-auto hover:bg-red-600 hover:text-white border-none"
                        >
                            {t('home.startChallenge')}
                        </Button>
                    </div>
                </div>
            ))}
         </div>
      </div>

    </div>
  );
};
