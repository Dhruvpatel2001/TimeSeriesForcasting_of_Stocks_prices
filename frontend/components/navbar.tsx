'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { LineChart, Search, Home, Brain, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Stock Chart', href: '/chart', icon: LineChart },
  { name: 'Model Insights', href: '/insights', icon: Brain },
  { name: 'News & Sentiment', href: '/sentiment', icon: Newspaper },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <LineChart className="h-6 w-6" />
            <span className="font-bold">StockAI</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6 ml-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}