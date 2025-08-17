import React from 'react';
import { Button } from './button';
import { Logo } from './logo';

export const Navbar: React.FC<{onToggleTheme?:()=>void}> = ({onToggleTheme}) => {
  return (
    <header className="w-full bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo size="md" />
        <nav className="flex items-center gap-2">
          <button className="text-sm text-muted hover:text-ink">Docs</button>
          <button className="text-sm text-muted hover:text-ink">Pricing</button>
          <Button onClick={onToggleTheme} variant="ghost" size="sm">
            Toggle Theme
          </Button>
        </nav>
      </div>
    </header>
  );
};
