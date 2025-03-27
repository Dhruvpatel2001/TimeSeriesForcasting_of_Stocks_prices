'use client';

import { Navbar } from '@/components/navbar';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const modelComparisonData = [
  {
    name: 'RMSE',
    ARIMA: 0.45,
    LSTM: 0.38,
    Hybrid: 0.32,
  },
  {
    name: 'MAE',
    ARIMA: 0.38,
    LSTM: 0.32,
    Hybrid: 0.28,
  },
  {
    name: 'R² Score',
    ARIMA: 0.82,
    LSTM: 0.88,
    Hybrid: 0.92,
  },
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Model Insights</h1>
          <p className="text-muted-foreground">
            Performance metrics and model explanations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">RMSE</h3>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Root Mean Square Error - Lower is better</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <p className="mt-2 text-2xl font-bold">0.32</p>
            <Progress value={68} className="mt-2" />
            <p className="mt-1 text-sm text-muted-foreground">32% improvement from baseline</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">MAE</h3>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mean Absolute Error - Lower is better</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <p className="mt-2 text-2xl font-bold">0.28</p>
            <Progress value={72} className="mt-2" />
            <p className="mt-1 text-sm text-muted-foreground">28% improvement from baseline</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">R² Score</h3>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coefficient of Determination - Higher is better</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <p className="mt-2 text-2xl font-bold">0.92</p>
            <Progress value={92} className="mt-2" />
            <p className="mt-1 text-sm text-muted-foreground">92% of variance explained</p>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Model Performance Comparison</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ARIMA" fill="#8884d8" />
                <Bar dataKey="LSTM" fill="#82ca9d" />
                <Bar dataKey="Hybrid" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Model Explanation</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="arima">
              <AccordionTrigger>ARIMA Model</AccordionTrigger>
              <AccordionContent>
                ARIMA (Autoregressive Integrated Moving Average) analyzes time series
                data to predict future values based on past observations. It excels
                at capturing linear relationships and seasonal patterns in stock
                prices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lstm">
              <AccordionTrigger>LSTM Model</AccordionTrigger>
              <AccordionContent>
                Long Short-Term Memory (LSTM) networks are advanced neural networks
                designed to recognize patterns in sequence data. They can capture
                complex, non-linear relationships in stock price movements and
                maintain long-term dependencies.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hybrid">
              <AccordionTrigger>Hybrid Approach</AccordionTrigger>
              <AccordionContent>
                Our hybrid model combines the strengths of both ARIMA and LSTM. ARIMA
                captures linear trends and seasonality, while LSTM handles non-linear
                patterns and market sentiment impacts, resulting in more accurate
                predictions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}