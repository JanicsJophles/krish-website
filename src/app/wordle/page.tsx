import { WordleGame } from '@/components/Wordle/WordleGame';

export default function WordlePage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto">
        <WordleGame />
      </div>
    </main>
  );
} 