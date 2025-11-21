
import React, { useState, useEffect, useRef } from 'react';
import { GameState, RealSong } from '../types';
import { LEVELS } from '../constants';
import { Button } from './Button';
import { useTranslation } from '../i18n/I18nContext';

interface Props {
  song: RealSong;
  onBack: () => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const ShortcutBadge = ({ k, className = "" }: { k: string, className?: string }) => (
  <span className={`absolute text-[10px] font-mono font-bold bg-slate-900/80 text-slate-400 border border-slate-600 rounded px-1.5 py-0.5 pointer-events-none select-none ${className}`}>
    {k.toUpperCase()}
  </span>
);

export const RealSongGameArea: React.FC<Props> = ({ song, onBack, setGameState }) => {
  const { t } = useTranslation();
  const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Determine available chords based on level type (Major vs Minor)
  const levelConfig = LEVELS.find(l => l.type === song.levelType);
  const availableChords = levelConfig ? levelConfig.availableChords : [];

  // Helper to construct robust YouTube Embed URL
  const getYoutubeSrc = (id: string, start: number, end: number, autoplay: boolean) => {
    const params = new URLSearchParams();
    params.append('start', Math.floor(start).toString());
    params.append('end', Math.floor(end).toString());
    params.append('autoplay', autoplay ? '1' : '0');
    params.append('controls', '1'); // Enable controls so user can interact if autoplay fails
    params.append('playsinline', '1'); // Better for mobile
    params.append('rel', '0'); // No related videos
    params.append('modestbranding', '1');

    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // Re-trigger iframe reload to start from specific time with autoplay
    if (iframeRef.current) {
      iframeRef.current.src = getYoutubeSrc(song.youtubeId, song.startTime, song.endTime, true);
    }
  };

  const handleSelectChord = (chord: string) => {
    if (showFeedback) return;
    const firstEmptyIndex = selectedSlots.indexOf(null);
    if (firstEmptyIndex !== -1) {
      const newSlots = [...selectedSlots];
      newSlots[firstEmptyIndex] = chord;
      setSelectedSlots(newSlots);
    }
  };

  const handleClearSlot = (index: number) => {
    if (showFeedback) return;
    const newSlots = [...selectedSlots];
    newSlots[index] = null;
    setSelectedSlots(newSlots);
  };

  const isFull = (slots: (string | null)[]): slots is string[] => {
    return slots.every(s => s !== null);
  };

  const handleSubmit = () => {
    if (!isFull(selectedSlots)) return;
    
    const correct = selectedSlots.every((slot, idx) => slot === song.progression[idx]);
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
        setGameState(prev => ({ ...prev, score: prev.score + 50 }));
    }
  };

  const handleRetry = () => {
    setSelectedSlots([null, null, null, null]);
    setShowFeedback(false);
    setIsCorrect(false);
    setIsPlaying(false);
    // Reset player state
    if (iframeRef.current) {
        iframeRef.current.src = getYoutubeSrc(song.youtubeId, song.startTime, song.endTime, false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full p-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6 bg-slate-800/80 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-lg">
        <Button
            variant="secondary"
            onClick={onBack}
            className="pl-4 pr-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
            {t('common.back')}
        </Button>
        <div className="text-center">
             <h2 className="text-white font-bold text-lg">{song.title}</h2>
             <p className="text-indigo-400 text-sm">{song.artist}</p>
        </div>
        <div className="font-mono text-sm text-slate-400 border border-slate-700 px-3 py-1 rounded bg-slate-900">
            {song.key}
        </div>
      </div>

      {/* YouTube Player */}
      <div className="w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8 border-2 border-slate-700 relative group">
        <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={getYoutubeSrc(song.youtubeId, song.startTime, song.endTime, false)}
            title={song.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="z-0 relative"
        ></iframe>
        
        {!isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <button 
                    onClick={handlePlay}
                    className="w-20 h-20 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-transform transform hover:scale-110 shadow-lg z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 pl-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        )}
         {isPlaying && (
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                <Button onClick={handlePlay} variant="secondary" className="text-xs bg-slate-900/80 backdrop-blur pointer-events-auto">
                    Replay Loop ↻
                </Button>
            </div>
        )}
      </div>

      {/* Slots */}
      <div className="grid grid-cols-4 gap-3 md:gap-6 mb-10 w-full max-w-3xl px-2">
        {selectedSlots.map((slot, idx) => {
            const correctChord = song.progression[idx];
            const isSlotCorrect = showFeedback && slot === correctChord;
            const isSlotWrong = showFeedback && slot !== correctChord;

            return (
                <div 
                    key={idx}
                    onClick={() => handleClearSlot(idx)}
                    className={`
                        relative w-full aspect-[3/4] md:h-32 rounded-xl border-2 flex flex-col items-center justify-center text-2xl md:text-3xl font-bold cursor-pointer transition-all duration-300
                        ${slot ? 'bg-slate-800 text-white' : 'bg-slate-800/50 text-slate-600 border-slate-700'}
                        ${isSlotCorrect ? '!border-green-500 !bg-green-500/10 !text-green-400' : ''}
                        ${isSlotWrong ? '!border-red-500 !bg-red-500/10 !text-red-400' : ''}
                    `}
                >
                    <span className="absolute top-2 left-2 text-[10px] text-slate-600 font-mono">[{idx + 1}]</span>
                    {slot || "?"}
                    
                    {/* Reveal Correct Answer if Wrong */}
                    {isSlotWrong && (
                        <div className="absolute -bottom-8 text-green-400 text-sm font-bold font-mono bg-slate-900 px-2 py-1 rounded border border-green-500/30">
                            {correctChord}
                        </div>
                    )}
                </div>
            )
        })}
      </div>

       {/* Controls */}
       {!showFeedback ? (
        <div className="w-full max-w-3xl animate-fade-in">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-8">
            {availableChords.map((chord, idx) => (
              <button
                key={chord}
                onClick={() => handleSelectChord(chord)}
                disabled={isFull(selectedSlots)}
                className="relative p-3 md:p-4 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-xl font-bold text-lg shadow-lg border border-slate-600 hover:border-indigo-400 disabled:opacity-50"
              >
                {chord}
              </button>
            ))}
          </div>
          <div className="flex justify-center">
             <Button 
                onClick={handleSubmit} 
                disabled={!isFull(selectedSlots)}
                fullWidth 
                className="max-w-xs py-3 text-lg font-bold"
            >
                {t('game.submit')}
             </Button>
          </div>
        </div>
       ) : (
        <div className="text-center animate-fade-in">
            <h3 className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? t('feedback.perfect') : t('feedback.defaultIncorrect')}
            </h3>
            {!isCorrect ? (
                 <Button onClick={handleRetry} variant="secondary" className="min-w-[150px]">
                    Retry
                 </Button>
            ) : (
                 <Button onClick={onBack} variant="primary" className="min-w-[150px]">
                    {t('common.back')}
                 </Button>
            )}
        </div>
       )}
    </div>
  );
};
