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
    const baseClasses = "w-12 h-12 border-2 flex items-center justify-center text-xl font-bold uppercase";
    
    if (!letter) return `${baseClasses} border-gray-300 dark:border-gray-600`;
    
    if (gameState === 'won' && guesses[rowIndex] === word) {
      return `${baseClasses} border-green-500 bg-green-500 text-white`;
    }
    
    if (word[index] === letter) {
      return `${baseClasses} border-green-500 bg-green-500 text-white`;
    }
    if (word.includes(letter)) {
      return `${baseClasses} border-yellow-500 bg-yellow-500 text-white`;
    }
    
    return `${baseClasses} border-gray-500 bg-gray-500 text-white`;
  };


  return (
    <div className="grid grid-rows-6 gap-1">
      {Array(6).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-1">
          {Array(5).fill(null).map((_, colIndex) => {
            const letter = rowIndex === currentRow 
              ? currentGuess[colIndex] || ''
              : (guesses[rowIndex] || '')[colIndex] || '';

            const bgColor = rowIndex < currentRow 
              ? getLetterClassName(letter, colIndex, word, rowIndex)
              : 'bg-gray-100 dark:bg-gray-800';

            return (
              <div
                key={colIndex}
                className={`w-12 h-12 border-2 border-gray-300 dark:border-gray-700 
                  flex items-center justify-center text-xl font-bold rounded-lg
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