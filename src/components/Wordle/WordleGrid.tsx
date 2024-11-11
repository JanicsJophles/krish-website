'use client';

export interface WordleGridProps {
  guesses: string[];
  currentGuess: string;
  currentRow: number;
  solution: string;
}

export const WordleGrid = ({ guesses, currentGuess, currentRow, solution }: WordleGridProps) => {
  const getBackgroundColor = (letter: string, index: number, row: number) => {
    if (row >= guesses.length || !guesses[row]) return 'bg-gray-100 dark:bg-gray-800';
    
    const solutionLetters = solution.split('');
    if (letter === solutionLetters[index]) return 'bg-green-500 dark:bg-green-600';
    if (solutionLetters.includes(letter)) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-gray-500 dark:bg-gray-600';
  };

  return (
    <div className="grid grid-rows-6 gap-2">
      {Array(6).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {Array(5).fill(null).map((_, colIndex) => {
            const letter = rowIndex === currentRow 
              ? currentGuess[colIndex] || ''
              : (guesses[rowIndex] || '')[colIndex] || '';

            const bgColor = rowIndex < currentRow 
              ? getBackgroundColor(letter, colIndex, rowIndex)
              : 'bg-gray-100 dark:bg-gray-800';

            return (
              <div
                key={colIndex}
                className={`w-14 h-14 border-2 border-gray-300 dark:border-gray-700 
                  flex items-center justify-center text-2xl font-bold rounded-lg
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