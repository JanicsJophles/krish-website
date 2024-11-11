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
    const usedLetters = new Set<string>();
    const correctLetters = new Set<string>();
    const presentLetters = new Set<string>();

    guesses.forEach(guess => {
      if (!guess) return;
      guess.split('').forEach((letter, i) => {
        usedLetters.add(letter);
        if (solution[i] === letter) {
          correctLetters.add(letter);
        } else if (solution.includes(letter)) {
          presentLetters.add(letter);
        }
      });
    });

    if (correctLetters.has(key)) return 'bg-green-500 dark:bg-green-600 text-white';
    if (presentLetters.has(key)) return 'bg-yellow-500 dark:bg-yellow-600 text-white';
    if (usedLetters.has(key)) return 'bg-gray-500 dark:bg-gray-600 text-white';
    return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`${
                key.length > 1 ? 'px-4' : 'w-11'
              } h-14 font-bold rounded-lg transition-all duration-200 
              shadow-sm hover:shadow-md active:scale-95 ${getKeyStatus(key)}`}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}; 