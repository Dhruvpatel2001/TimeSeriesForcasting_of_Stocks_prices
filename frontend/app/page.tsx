'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    // Redirect authenticated users to their dashboard
    if (userRole === 'admin') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Stock Price Prediction
            <br />
            <span className="text-primary">Powered by AI</span>
          </h1>
          <p className="mt-4 max-w-[700px] text-muted-foreground">
            Advanced stock price predictions using a hybrid ARIMA + LSTM model.
            Get real-time insights, sentiment analysis, and accurate forecasts.
          </p>
          <div className="mt-8 flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Real-time Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get instant stock price predictions and market insights powered by our
              advanced AI models.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Stay informed with real-time news sentiment analysis and market
              sentiment indicators.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Advanced Predictions</h3>
            <p className="text-sm text-muted-foreground">
              Leverage our hybrid ARIMA + LSTM model for accurate short and
              long-term predictions.
            </p>
          </div>
        </div>

        <div className="mt-20 rounded-lg border bg-card p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-4 text-muted-foreground">
                Our system combines traditional statistical methods with deep
                learning to provide accurate stock price predictions. We analyze
                historical data, market trends, and news sentiment to give you
                comprehensive market insights.
              </p>
              <Button className="mt-6 w-fit">Learn More</Button>
            </div>
            <div className="relative aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80"
                alt="Stock market visualization"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}