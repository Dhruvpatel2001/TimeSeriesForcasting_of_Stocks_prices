'use client';

import { Card } from '@/components/ui/card';
import { LineChart } from '@/components/charts/line-chart';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const sentimentData = {
  positive: 45,
  neutral: 30,
  negative: 25,
};

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
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor sentiment analysis and market trends
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold">Positive Sentiment</h3>
          <p className="mt-2 text-2xl font-bold">{sentimentData.positive}%</p>
          <Progress value={sentimentData.positive} className="mt-2" />
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Neutral Sentiment</h3>
          <p className="mt-2 text-2xl font-bold">{sentimentData.neutral}%</p>
          <Progress value={sentimentData.neutral} className="mt-2" />
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Negative Sentiment</h3>
          <p className="mt-2 text-2xl font-bold">{sentimentData.negative}%</p>
          <Progress value={sentimentData.negative} className="mt-2" />
        </Card>
      </div>

      <Card className="mt-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">Sentiment Trend</h2>
        <div className="h-[300px]">
          <LineChart 
            data={trendData}
            xAxisDataKey="date"
            lines={[
              { dataKey: 'sentiment', name: 'Sentiment Score', color: 'hsl(var(--chart-1))' }
            ]}
          />
        </div>
      </Card>

      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Recent News</h2>
          <p className="text-sm text-muted-foreground">
            Latest market updates and analysis
          </p>
        </div>
        <ScrollArea className="h-[400px]">
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
  );
}