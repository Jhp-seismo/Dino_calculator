import Calculator from './components/Calculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex flex-col items-center justify-center p-4">
      <Calculator />
      <footer className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Emotional Calculator - Made with React & Next.js
      </footer>
    </div>
  );
}
