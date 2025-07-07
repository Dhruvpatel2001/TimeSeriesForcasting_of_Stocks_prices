'use client';

import { Navbar } from '@/components/navbar';
import { Card } from '@/components/ui/card';
import { LineChart } from '@/components/charts/line-chart';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Mock data - replace with actual API call
const data = [
  { date: '2024-01', actual: 150, predicted: 155 },
  { date: '2024-02', actual: 155, predicted: 158 },
  { date: '2024-03', actual: 160, predicted: 162 },
  { date: '2024-04', actual: 158, predicted: 165 },
  { date: '2024-05', actual: 165, predicted: 168 },
];

export default function ChartPage() {
  const [symbol, setSymbol] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stock Price Analysis</h1>
          <p className="text-muted-foreground">
            View historical and predicted stock prices
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

        <Card className="p-6">
          <div className="h-[400px] w-full">
            <LineChart 
              data={data}
              xAxisDataKey="date"
              lines={[
                { dataKey: 'actual', name: 'Actual Price', color: 'hsl(var(--chart-1))' },
                { dataKey: 'predicted', name: 'Predicted Price', color: 'hsl(var(--chart-2))' }
              ]}
            />
          </div>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold">Current Price</h3>
            <p className="mt-2 text-2xl font-bold">$165.00</p>
            <p className="text-sm text-green-500">+2.5%</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Predicted (7 Days)</h3>
            <p className="mt-2 text-2xl font-bold">$168.25</p>
            <p className="text-sm text-green-500">+1.97%</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Confidence Score</h3>
            <p className="mt-2 text-2xl font-bold">85%</p>
            <p className="text-sm text-muted-foreground">Based on model accuracy</p>
          </Card>
        </div>
      </div>
    </div>
  );
}