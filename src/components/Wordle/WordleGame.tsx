'use client';

import { useState, useEffect, useCallback } from 'react';
import { WordleKeyboard } from './WordleKeyboard';
import { WordleGrid } from './WordleGrid';
import toast, { Toaster } from 'react-hot-toast';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastGameState?: string;
}

export const WordleGame = () => {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameState, setGameState] = useState<string>('playing');
  const [showStats, setShowStats] = useState(false);

  const getInitialStats = (): GameStats => {
    if (typeof window === 'undefined') return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0
    };

    const stats = localStorage.getItem('wordleStats');
    return stats ? JSON.parse(stats) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0
    };
  };

  const [stats, setStats] = useState<GameStats>(getInitialStats);

  // Make sure to interact with localStorage only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGuesses = localStorage.getItem('wordleGuesses');
      const savedCurrentGuess = localStorage.getItem('wordleCurrentGuess');
      const savedGameState = localStorage.getItem('wordleGameState');

      setGuesses(savedGuesses ? JSON.parse(savedGuesses) : []);
      setCurrentGuess(savedCurrentGuess || '');
      setGameState(savedGameState || 'playing');
    }
  }, []);

  const checkWordExists = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const getRandomWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
      const [randomWord] = await response.json();
      const isValid = await checkWordExists(randomWord);
      if (isValid) {
        return randomWord.toUpperCase();
      }
      return getRandomWord();
    } catch (error) {
      console.error('Error fetching random word:', error);
      return 'REACT';
    }
  };

  const onKeyPress = useCallback(async (key: string) => {
    if (gameState !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        toast.error('Word must be 5 letters long!');
        return;
      }
      
      const guessLower = currentGuess.toLowerCase();
      const isValidWord = await checkWordExists(guessLower);
      
      if (!isValidWord) {
        toast.error('Not a valid word!');
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === word) {
        setGameState('won');
      } else if (newGuesses.length === 6) {
        setGameState('lost');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
    }
  }, [gameState, guesses, word, currentGuess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, onKeyPress, currentGuess]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWord = localStorage.getItem('wordleWord');
      const savedDate = localStorage.getItem('wordleDate');
      const today = new Date().toDateString();

      if (savedWord && savedDate === today) {
        setWord(savedWord);
      } else {
        // Handle async word fetching properly
        const fetchNewWord = async () => {
          const newWord = await getRandomWord();
          setWord(newWord);
          localStorage.setItem('wordleWord', newWord);
          localStorage.setItem('wordleDate', today);
        };
        fetchNewWord();
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordleGuesses', JSON.stringify(guesses));
      localStorage.setItem('wordleCurrentGuess', currentGuess);
      localStorage.setItem('wordleGameState', gameState);
    }
  }, [guesses, currentGuess, gameState]);

  // Update stats when game ends
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== stats.lastGameState) {
      const newStats = { ...stats };
      
      // Only increment if this is a new game ending
      if (gameState !== stats.lastGameState) {
        newStats.gamesPlayed++;
        
        if (gameState === 'won') {
          newStats.gamesWon++;
          newStats.currentStreak++;
          newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
        } else if (gameState === 'lost') {
          newStats.currentStreak = 0;
        }
        
        newStats.lastGameState = gameState;
        setStats(newStats);
        localStorage.setItem('wordleStats', JSON.stringify(newStats));
      }
      
      setShowStats(true);
    }
  }, [gameState, stats]);

  const handlePlayAgain = async () => {
    const newWord = await getRandomWord();
    setWord(newWord);
    localStorage.setItem('wordleWord', newWord);
    localStorage.setItem('wordleDate', new Date().toDateString());
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setShowStats(false);
    
    // Reset lastGameState when starting a new game
    const newStats = { ...stats, lastGameState: 'playing' };
    setStats(newStats);
    localStorage.setItem('wordleStats', JSON.stringify(newStats));
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center bg-white dark:bg-gray-900 overflow-hidden pt-24">
      <div className="w-full max-w-lg mx-auto px-4 flex flex-col h-full">
        <Toaster 
          position="top-center"
          containerStyle={{
            top: '1rem',
          }}
          toastOptions={{
            style: {
              zIndex: 50,
            },
            duration: 1500,
          }}
        />
        
        {/* Main game section - centered in remaining space */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {/* Header section */}
          <header className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wordle
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Guess the 5-letter word in 6 tries
            </p>
          </header>

          <div className="flex justify-center">
            <WordleGrid 
              guesses={guesses}
              currentGuess={currentGuess}
              currentRow={guesses.length}
              word={word}
              gameState={gameState}
            />
          </div>
          
          <div className="w-full max-w-md mx-auto mt-auto">
            <WordleKeyboard 
              onKeyPress={onKeyPress}
              guesses={guesses}
              solution={word}
            />
          </div>
        </div>
        
        {/* Stats Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
               style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-[90%] sm:w-full shadow-lg m-4">
              <h2 className="text-2xl font-bold text-center mb-6">
                {gameState === 'won' ? '🎉 Congratulations!' : `💔 Game Over`}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Played</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {stats.gamesPlayed > 0 
                      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.currentStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.maxStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Max Streak</div>
                </div>
              </div>

              {gameState === 'lost' && (
                <div className="text-center mb-6 text-lg">
                  The word was: <span className="font-bold">{word}</span>
                </div>
              )}
              
              <button
                onClick={handlePlayAgain}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
