'use client';

import { useState, useEffect, useCallback } from 'react';
import { WordleKeyboard } from './WordleKeyboard';
import { WordleGrid } from './WordleGrid';
import toast, { Toaster } from 'react-hot-toast';

export const WordleGame = () => {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameState, setGameState] = useState<string>('playing');

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

  const handlePlayAgain = async () => {
    const newWord = await getRandomWord();
    setWord(newWord);
    localStorage.setItem('wordleWord', newWord);
    localStorage.setItem('wordleDate', new Date().toDateString());
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-lg mx-auto mt-2">
      <Toaster />
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Wordle
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Guess the 5-letter word in 6 tries
        </p>
      </div>
      <WordleGrid 
        guesses={guesses}
        currentGuess={currentGuess}
        currentRow={guesses.length}
        word={word}
        gameState={gameState}
      />
      <WordleKeyboard 
        onKeyPress={onKeyPress}
        guesses={guesses}
        solution={word}
      />
      {gameState !== 'playing' && (
        <div className="space-y-2 text-center">
          <div className={`text-lg font-bold p-2 rounded-lg ${
            gameState === 'won' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}>
            {gameState === 'won' ? '🎉 Congratulations!' : `💔 The word was: ${word}`}
          </div>
          <button
            onClick={handlePlayAgain}
            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}; 
