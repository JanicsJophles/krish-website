'use client';

import { useState, useEffect, useCallback } from 'react';
import { WordleKeyboard } from './WordleKeyboard';
import { WordleGrid } from './WordleGrid';
import toast, { Toaster } from 'react-hot-toast';

export const WordleGame = () => {
  const [solution, setSolution] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const checkWordExists = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const onKeyPress = useCallback(async (key: string) => {
    if (gameOver) return;

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

      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      setGuesses(newGuesses);

      if (currentGuess === solution) {
        setGameOver(true);
        setWon(true);
        toast.success('Brilliant!', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#34D399',
            color: 'white',
            fontWeight: 'bold',
          },
        });
        return;
      }

      if (currentRow === 5) {
        setGameOver(true);
        toast('Better luck next time!', {
          duration: 2000,
          position: 'top-center',
          icon: '💔',
          style: {
            fontWeight: 'bold',
          },
        });
        return;
      }

      setCurrentRow(currentRow + 1);
      setCurrentGuess('');
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
    } else {
      toast.error('Maximum 5 letters!', {
        duration: 500,
        position: 'top-center',
        style: {
          background: '#F87171',
          color: 'white',
          fontWeight: 'bold',
        },
      });
    }
  }, [gameOver, guesses, solution, currentGuess, currentRow]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, onKeyPress, currentGuess]);

  useEffect(() => {
    const savedState = localStorage.getItem('wordleState');
    if (savedState) {
      const { 
        solution, 
        guesses, 
        currentRow, 
        gameOver, 
        won,
        timestamp 
      } = JSON.parse(savedState);

      const now = new Date().toDateString();
      const savedDate = new Date(timestamp).toDateString();
      
      if (now === savedDate) {
        setSolution(solution);
        setGuesses(guesses);
        setCurrentRow(currentRow);
        setGameOver(gameOver);
        setWon(won);
      } else {
        setSolution('REACT');
        localStorage.setItem('wordleState', JSON.stringify({
          solution: 'REACT',
          guesses: Array(6).fill(''),
          currentRow: 0,
          gameOver: false,
          won: false,
          timestamp: new Date().toISOString()
        }));
      }
    } else {
      setSolution('REACT');
      localStorage.setItem('wordleState', JSON.stringify({
        solution: 'REACT',
        guesses: Array(6).fill(''),
        currentRow: 0,
        gameOver: false,
        won: false,
        timestamp: new Date().toISOString()
      }));
    }
  }, []);

  useEffect(() => {
    if (solution) {
      localStorage.setItem('wordleState', JSON.stringify({
        solution,
        guesses,
        currentRow,
        gameOver,
        won,
        timestamp: new Date().toISOString()
      }));
    }
  }, [solution, guesses, currentRow, gameOver, won]);

  const handlePlayAgain = () => {
    setSolution('REACT');
    setGuesses(Array(6).fill(''));
    setCurrentGuess('');
    setCurrentRow(0);
    setGameOver(false);
    setWon(false);
    localStorage.setItem('wordleState', JSON.stringify({
      solution: 'REACT',
      guesses: Array(6).fill(''),
      currentRow: 0,
      gameOver: false,
      won: false,
      timestamp: new Date().toISOString()
    }));
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 max-w-lg mx-auto mt-8">
      <Toaster />
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Wordle
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Guess the 5-letter word in 6 tries
        </p>
      </div>
      <WordleGrid 
        guesses={guesses}
        currentGuess={currentGuess}
        currentRow={currentRow}
        solution={solution}
      />
      <WordleKeyboard 
        onKeyPress={onKeyPress}
        guesses={guesses}
        solution={solution}
      />
      {gameOver && (
        <div className="space-y-4 text-center">
          <div className={`text-xl font-bold p-4 rounded-lg ${
            won ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}>
            {won ? '🎉 Congratulations!' : `💔 The word was: ${solution}`}
          </div>
          <button
            onClick={handlePlayAgain}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}; 