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
    const baseClasses = "w-[3.25rem] h-[3.25rem] sm:w-16 sm:h-16 border-2 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase";
    
    if (!letter) return `${baseClasses} border-border`;
    
    if (gameState === 'won' && guesses[rowIndex] === word) {
      return `${baseClasses} border-green-500 bg-green-500 text-white`;
    }

    const letterCount = word.split('').reduce((acc, curr) => 
      curr === letter ? acc + 1 : acc, 0
    );

    const correctPositions = guess.split('').reduce((acc, curr, i) => 
      curr === letter && word[i] === letter ? [...acc, i] : acc, [] as number[]
    );

    if (word[index] === letter) {
      return `${baseClasses} border-green-500 bg-green-500 text-white`;
    }

    if (correctPositions.length >= letterCount) {
      return `${baseClasses} border-gray-500 bg-gray-500 text-white`;
    }

    const previousInstances = guess.slice(0, index).split('')
      .filter(l => l === letter).length;

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
              : 'bg-background';

            return (
              <div
                key={colIndex}
                className={`w-[3.25rem] h-[3.25rem] sm:w-16 sm:h-16 border-2 border-border 
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