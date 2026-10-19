import React from 'react';
import Link from 'next/link';
import { Keyboard, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-6 shadow-xl shadow-sky-500/10">
        <Keyboard className="w-8 h-8" />
      </div>

      <span className="font-mono text-sm font-semibold text-sky-400 tracking-widest uppercase mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        The key or passage you are searching for does not exist in the Keyora index.
      </p>

      <Link href="/">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Speed Test
        </Button>
      </Link>
    </div>
  );
}
