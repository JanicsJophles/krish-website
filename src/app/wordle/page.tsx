import { WordleGame } from '@/components/Wordle/WordleGame';

export default function WordlePage() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden fixed inset-0">
      <WordleGame />
    </main>
  );
} 