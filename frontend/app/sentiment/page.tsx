'use client';

import { Navbar } from '@/components/navbar';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const sentimentData = {
  positive: 45,
  neutral: 30,
  negative: 25,
};

const pieData = [
  { name: 'Positive', value: 45 },
  { name: 'Neutral', value: 30 },
  { name: 'Negative', value: 25 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

const trendData = [
  { date: '2024-01', sentiment: 0.6 },
  { date: '2024-02', sentiment: 0.8 },
  { date: '2024-03', sentiment: 0.4 },
  { date: '2024-04', sentiment: 0.7 },
  { date: '2024-05', sentiment: 0.5 },
];

const newsData = [
  {
    id: 1,
    title: 'Tech Giant Announces Revolutionary AI Platform',
    source: 'TechNews',
    timestamp: '2 hours ago',
    sentiment: 'positive',
    url: '#',
  },
  {
    id: 2,
    title: 'Market Volatility Continues Amid Global Tensions',
    source: 'FinanceDaily',
    timestamp: '3 hours ago',
    sentiment: 'negative',
    url: '#',
  },
  {
    id: 3,
    title: 'Central Bank Maintains Current Interest Rates',
    source: 'EconomicTimes',
    timestamp: '4 hours ago',
    sentiment: 'neutral',
    url: '#',
  },
  // Add more news items...
];

export default function SentimentPage() {
  const [symbol, setSymbol] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">News & Sentiment Analysis</h1>
          <p className="text-muted-foreground">
            Real-time market sentiment and news analysis
          </p>
        </div>

        <div className="mb-8 flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Enter stock symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="max-w-xs"
          />
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Analyze
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Sentiment Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Sentiment Scores</h2>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span>Positive</span>
                  <span>{sentimentData.positive}%</span>
                </div>
                <Progress value={sentimentData.positive} className="bg-muted" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span>Neutral</span>
                  <span>{sentimentData.neutral}%</span>
                </div>
                <Progress value={sentimentData.neutral} className="bg-muted" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span>Negative</span>
                  <span>{sentimentData.negative}%</span>
                </div>
                <Progress value={sentimentData.negative} className="bg-muted" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Sentiment Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sentiment"
                  stroke="hsl(var(--chart-1))"
                  name="Sentiment Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Latest News</h2>
            <p className="text-sm text-muted-foreground">
              Real-time financial news and market updates
            </p>
          </div>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-6">
              {newsData.map((news) => (
                <div
                  key={news.id}
                  className="mb-6 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <a
                        href={news.url}
                        className="text-lg font-medium hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {news.title}
                      </a>
                      <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.timestamp}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        news.sentiment === 'positive'
                          ? 'default'
                          : news.sentiment === 'negative'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {news.sentiment}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}