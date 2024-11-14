'use client';

export interface WordleKeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  solution: string;
}

export const WordleKeyboard = ({ onKeyPress, guesses, solution }: WordleKeyboardProps) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  const getKeyStatus = (key: string) => {
    const flatGuesses = guesses.join('');
    if (!flatGuesses.includes(key)) return 'unused';
    
    for (const guess of guesses) {
      if (!guess) continue;
      
      const index = guess.indexOf(key);
      if (index >= 0) {
        if (solution[index] === key) {
          return 'correct';
        }
      }
    }
    
    return solution.includes(key) ? 'present' : 'absent';
  };

  const getKeyClassName = (key: string) => {
    const status = getKeyStatus(key);
    const baseClasses = "flex-1 min-w-[2rem] px-3 py-4 m-0.5 text-sm font-bold rounded transition-colors duration-200";
    
    const specialKeyClasses = key === 'ENTER' || key === 'BACKSPACE' 
      ? 'min-w-[4.5rem]' 
      : '';
    
    switch (status) {
      case 'correct':
        return `${baseClasses} ${specialKeyClasses} bg-green-500 text-white hover:bg-green-600`;
      case 'present':
        return `${baseClasses} ${specialKeyClasses} bg-yellow-500 text-white hover:bg-yellow-600`;
      case 'absent':
        return `${baseClasses} ${specialKeyClasses} bg-gray-700 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-900`;
      default:
        return `${baseClasses} ${specialKeyClasses} bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700`;
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xl">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={getKeyClassName(key)}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}; 