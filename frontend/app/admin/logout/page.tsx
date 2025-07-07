'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Cookies from 'js-cookie';

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('isAuthenticated');
    Cookies.remove('userRole');
    router.replace('/auth');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <LogOut className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-6 text-2xl font-bold">Sign Out</h1>
        <p className="mt-2 text-muted-foreground">
          Are you sure you want to sign out?
        </p>
        <div className="mt-8 flex space-x-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Yes, Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}