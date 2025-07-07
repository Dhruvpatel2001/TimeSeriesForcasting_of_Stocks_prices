'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LineChart } from 'lucide-react';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate credentials
      if ((username === 'admin' && password === 'admin') || 
          (username === 'user' && password === 'user')) {
        
        const userRole = username === 'admin' ? 'admin' : 'user';
        
        // Store authentication in localStorage for immediate access
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', userRole);

        // Also set cookies for server-side middleware
        document.cookie = `isAuthenticated=true; path=/; max-age=${7 * 24 * 60 * 60}`;
        document.cookie = `userRole=${userRole}; path=/; max-age=${7 * 24 * 60 * 60}`;

        toast({
          title: 'Success',
          description: 'Successfully logged in!'
        });

        // Small delay to ensure state is set
        await new Promise(resolve => setTimeout(resolve, 100));

        // Navigate based on role
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,white)]" />
      </div>
      
      <Card className="w-full max-w-md p-8 backdrop-blur-sm bg-background/95">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <LineChart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to StockAI</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full transition-all duration-200 hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>Admin: admin/admin</p>
          <p>User: user/user</p>
        </div>
      </Card>
    </div>
  );
}