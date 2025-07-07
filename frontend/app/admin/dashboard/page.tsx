'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AdminSidebar } from '@/components/admin-sidebar';
import { LineChart } from '@/components/charts/line-chart';

const mockData = [
  { date: '2024-01', predictions: 150, actual: 155 },
  { date: '2024-02', predictions: 155, actual: 158 },
  { date: '2024-03', predictions: 160, actual: 162 },
  { date: '2024-04', predictions: 158, actual: 165 },
  { date: '2024-05', predictions: 165, actual: 168 },
];

const mockUsers = [
  { id: 1, username: 'user1', lastActive: '2024-03-20' },
  { id: 2, username: 'user2', lastActive: '2024-03-19' },
  { id: 3, username: 'user3', lastActive: '2024-03-18' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [modelAccuracy, setModelAccuracy] = useState(92);
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system performance and manage users
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold">Model Accuracy</h3>
            <p className="mt-2 text-2xl font-bold">{modelAccuracy}%</p>
            <Progress value={modelAccuracy} className="mt-2" />
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Active Users</h3>
            <p className="mt-2 text-2xl font-bold">{mockUsers.length}</p>
            <Progress value={75} className="mt-2" />
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">API Requests</h3>
            <p className="mt-2 text-2xl font-bold">2,547</p>
            <Progress value={65} className="mt-2" />
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Prediction Accuracy</h2>
          <div className="h-[400px]">
            <LineChart 
              data={mockData}
              xAxisDataKey="date"
              lines={[
                { dataKey: 'predictions', name: 'Predicted', color: 'hsl(var(--chart-1))' },
                { dataKey: 'actual', name: 'Actual', color: 'hsl(var(--chart-2))' }
              ]}
            />
          </div>
        </Card>

        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="mt-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-3 gap-4 border-b p-4 font-medium">
                  <div>Username</div>
                  <div>Last Active</div>
                  <div>Actions</div>
                </div>
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-3 gap-4 border-b p-4 last:border-0"
                  >
                    <div>{user.username}</div>
                    <div>{user.lastActive}</div>
                    <div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          // Handle user deletion
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}