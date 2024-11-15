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
    const letterCount = solution.split('').reduce((acc, curr) => 
      curr === key ? acc + 1 : acc, 0
    );
    
    let correctCount = 0;
    let presentCount = 0;
    
    for (const guess of guesses) {
      if (!guess) continue;
      
      guess.split('').forEach((letter, index) => {
        if (letter === key && solution[index] === key) {
          correctCount++;
        }
      });
      
      if (correctCount < letterCount) {
        guess.split('').forEach((letter, index) => {
          if (letter === key && solution[index] !== key) {
            if (presentCount + correctCount < letterCount) {
              presentCount++;
            }
          }
        });
      }
    }
    
    if (correctCount > 0) return 'correct';
    if (presentCount > 0) return 'present';
    return guesses.some(guess => guess?.includes(key)) ? 'absent' : 'unused';
  };

  const getKeyClassName = (key: string) => {
    const status = getKeyStatus(key);
    const baseClasses = "touch-manipulation select-none flex-1 px-1 py-2 m-0.5 text-sm sm:text-base font-bold rounded-md transition-colors duration-200";
    
    const specialKeyClasses = key === 'ENTER' || key === 'BACKSPACE' 
      ? 'min-w-[3.5rem] sm:min-w-[4.5rem]' 
      : 'min-w-[1.75rem] sm:min-w-[2.25rem]';
    
    switch (status) {
      case 'correct':
        return `${baseClasses} ${specialKeyClasses} bg-green-500 text-white active:bg-green-600`;
      case 'present':
        return `${baseClasses} ${specialKeyClasses} bg-yellow-500 text-white active:bg-yellow-600`;
      case 'absent':
        return `${baseClasses} ${specialKeyClasses} bg-gray-700 dark:bg-gray-800 text-white active:bg-gray-800 dark:active:bg-gray-900`;
      default:
        return `${baseClasses} ${specialKeyClasses} bg-gray-200 dark:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-700`;
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-xl mx-auto px-0.5 pb-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1 justify-center">
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