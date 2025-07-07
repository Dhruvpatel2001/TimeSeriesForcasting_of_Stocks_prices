'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart } from '@/components/charts/line-chart';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Info } from 'lucide-react';

const forecastData = [
  { date: '2024-01', actual: 150, predicted: 155 },
  { date: '2024-02', actual: 155, predicted: 158 },
  { date: '2024-03', actual: 160, predicted: 162 },
  { date: '2024-04', actual: 158, predicted: 165 },
  { date: '2024-05', actual: 165, predicted: 168 },
];

const modelComparison = [
  {
    metric: 'RMSE',
    arima: 0.45,
    lstm: 0.38,
    hybrid: 0.32,
    description: 'Root Mean Square Error - Lower is better',
  },
  {
    metric: 'MAE',
    arima: 0.38,
    lstm: 0.32,
    hybrid: 0.28,
    description: 'Mean Absolute Error - Lower is better',
  },
  {
    metric: 'R² Score',
    arima: 0.82,
    lstm: 0.88,
    hybrid: 0.92,
    description: 'Coefficient of Determination - Higher is better',
  },
];

export default function ModelInsightsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    
    if (userRole !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    setIsLoading(false);
  }, [router]);

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
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Model Insights</h1>
          <p className="text-muted-foreground">
            Performance metrics and model analysis
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {modelComparison.map((metric) => (
            <Card key={metric.metric} className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{metric.metric}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{metric.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-2 text-2xl font-bold">{metric.hybrid}</p>
              <Progress
                value={metric.metric === 'R² Score' ? metric.hybrid * 100 : (1 - metric.hybrid) * 100}
                className="mt-2"
              />
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Stock Price Forecast</h2>
          <div className="h-[400px]">
            <LineChart 
              data={forecastData}
              xAxisDataKey="date"
              lines={[
                { dataKey: 'actual', name: 'Actual Price', color: 'hsl(var(--chart-1))' },
                { dataKey: 'predicted', name: 'Predicted Price', color: 'hsl(var(--chart-2))' }
              ]}
            />
          </div>
        </Card>

        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Model Comparison</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>ARIMA</TableHead>
                <TableHead>LSTM</TableHead>
                <TableHead>Hybrid Model</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelComparison.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell>{row.arima}</TableCell>
                  <TableCell>{row.lstm}</TableCell>
                  <TableCell>{row.hybrid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Model Explanation</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="hybrid">
              <AccordionTrigger>Hybrid Model Architecture</AccordionTrigger>
              <AccordionContent>
                Our hybrid model combines ARIMA and LSTM approaches for optimal
                performance. ARIMA handles linear patterns and seasonality, while
                LSTM captures complex non-linear relationships and long-term
                dependencies in the data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sentiment">
              <AccordionTrigger>Sentiment Analysis Integration</AccordionTrigger>
              <AccordionContent>
                Real-time news sentiment is analyzed using NLP techniques and
                integrated into the prediction model. This helps capture market
                sentiment impact on stock prices, improving prediction accuracy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="training">
              <AccordionTrigger>Training Process</AccordionTrigger>
              <AccordionContent>
                The model is trained on historical price data combined with
                sentiment scores. Regular retraining ensures the model adapts to
                changing market conditions and maintains high accuracy.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </main>
    </div>
  );
}