'use client';

import { useState, useEffect, useCallback } from 'react';
import { WordleKeyboard } from './WordleKeyboard';
import { WordleGrid } from './WordleGrid';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastGameState?: string;
}

const checkWordExists = async (word: string) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.ok;
  } catch {
    return false;
  }
};

const getRandomWord = async (): Promise<string> => {
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

export const WordleGame = () => {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameState, setGameState] = useState<string>('playing');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('wordleStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    const savedGuesses = localStorage.getItem('wordleGuesses');
    const savedCurrentGuess = localStorage.getItem('wordleCurrentGuess');
    const savedGameState = localStorage.getItem('wordleGameState');

    if (savedGuesses) setGuesses(JSON.parse(savedGuesses));
    if (savedCurrentGuess) setCurrentGuess(savedCurrentGuess);
    if (savedGameState) setGameState(savedGameState);

    const savedWord = localStorage.getItem('wordleWord');
    const savedDate = localStorage.getItem('wordleDate');
    const today = new Date().toDateString();

    if (savedWord && savedDate === today) {
      setWord(savedWord);
    } else {
      getRandomWord().then(newWord => {
        setWord(newWord);
        localStorage.setItem('wordleWord', newWord);
        localStorage.setItem('wordleDate', today);
      });
    }
  }, []);

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
  }, [gameState, onKeyPress]);

  useEffect(() => {
    localStorage.setItem('wordleGuesses', JSON.stringify(guesses));
    localStorage.setItem('wordleCurrentGuess', currentGuess);
    localStorage.setItem('wordleGameState', gameState);
  }, [guesses, currentGuess, gameState]);

  useEffect(() => {
    if (gameState !== 'playing' && gameState !== stats.lastGameState) {
      const newStats = { ...stats };
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

    const newStats = { ...stats, lastGameState: 'playing' };
    setStats(newStats);
    localStorage.setItem('wordleStats', JSON.stringify(newStats));
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center bg-background overflow-hidden pt-20">
      <div className="w-full max-w-lg mx-auto px-2 flex flex-col h-full">
        <Toaster
          position="top-center"
          containerStyle={{ top: '1rem' }}
          toastOptions={{
            style: { zIndex: 50 },
            duration: 1500,
          }}
        />

        <div className="flex-1 flex flex-col justify-between gap-4">
          <header className="text-center mt-2">
            <h1 className="text-2xl font-bold text-foreground">Wordle</h1>
            <p className="text-xs text-muted-foreground mb-4">
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

          <div className="w-full max-w-md mx-auto">
            <WordleKeyboard
              onKeyPress={onKeyPress}
              guesses={guesses}
              solution={word}
            />
          </div>
        </div>

        {showStats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-sm w-[90%] sm:w-full m-4">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {gameState === 'won' ? '🎉 Congratulations!' : `💔 Game Over`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
                    <div className="text-sm text-muted-foreground">Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {stats.gamesPlayed > 0
                        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.maxStreak}</div>
                    <div className="text-sm text-muted-foreground">Max Streak</div>
                  </div>
                </div>

                {gameState === 'lost' && (
                  <div className="text-center text-lg">
                    The word was: <span className="font-bold">{word}</span>
                  </div>
                )}

                <Button onClick={handlePlayAgain} className="w-full">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
