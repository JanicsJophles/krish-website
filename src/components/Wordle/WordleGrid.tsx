'use client';

export interface WordleGridProps {
  guesses: string[];
  currentGuess: string;
  word: string;
  gameState: string;
  currentRow: number;
}

export const WordleGrid = ({ guesses, currentGuess, word, gameState, currentRow }: WordleGridProps) => {
  const getLetterClassName = (letter: string, index: number, guess: string, rowIndex: number) => {
    const baseClasses = "w-[3.25rem] h-[3.25rem] sm:w-14 sm:h-14 border-2 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase";
    
    if (!letter) return `${baseClasses} border-gray-300 dark:border-gray-600`;
    
    if (gameState === 'won' && guesses[rowIndex] === word) {
      return `${baseClasses} border-green-500 bg-green-500 text-white`;
    }

    // Count how many times the letter appears in the word
    const letterCount = word.split('').reduce((acc, curr) => 
      curr === letter ? acc + 1 : acc, 0
    );

    // Find all positions where this letter is correctly placed
    const correctPositions = guess.split('').reduce((acc, curr, i) => 
      curr === letter && word[i] === letter ? [...acc, i] : acc, [] as number[]
    );

    // If this position is correct, it's always green
    if (word[index] === letter) {
      return `${baseClasses} border-green-500 bg-green-500 text-white`;
    }

    // If we've already found all instances of this letter in correct positions
    // and this isn't one of them, it should be gray
    if (correctPositions.length >= letterCount) {
      return `${baseClasses} border-gray-500 bg-gray-500 text-white`;
    }

    // Count how many times we've seen this letter up to this index
    const previousInstances = guess.slice(0, index).split('')
      .filter(l => l === letter).length;

    // If we still have remaining instances after accounting for correct positions,
    // show it as yellow
    if (previousInstances + correctPositions.length < letterCount) {
      return `${baseClasses} border-yellow-500 bg-yellow-500 text-white`;
    }
    
    return `${baseClasses} border-gray-500 bg-gray-500 text-white`;
  };


  return (
    <div className="grid grid-rows-6 gap-1 px-1">
      {Array(6).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-1">
          {Array(5).fill(null).map((_, colIndex) => {
            const letter = rowIndex === currentRow 
              ? currentGuess[colIndex] || ''
              : (guesses[rowIndex] || '')[colIndex] || '';

            const bgColor = rowIndex < currentRow 
              ? getLetterClassName(letter, colIndex, guesses[rowIndex], rowIndex)
              : 'bg-gray-100 dark:bg-gray-800';

            return (
              <div
                key={colIndex}
                className={`w-[3.25rem] h-[3.25rem] sm:w-14 sm:h-14 border-2 border-gray-300 dark:border-gray-700 
                  flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg
                  transition-all duration-300 ${bgColor}
                  ${letter ? 'scale-105' : 'scale-100'}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}; 