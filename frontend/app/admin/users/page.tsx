'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Trash2, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: 'user1@example.com',
    role: 'user',
    lastLogin: '2024-03-20 10:30 AM',
    status: 'active',
  },
  {
    id: 2,
    email: 'user2@example.com',
    role: 'admin',
    lastLogin: '2024-03-19 03:45 PM',
    status: 'active',
  },
  {
    id: 3,
    email: 'user3@example.com',
    role: 'user',
    lastLogin: '2024-03-18 09:15 AM',
    status: 'disabled',
  },
];

export default function UserManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', role: 'user' });
  const [isCreating, setIsCreating] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/db/users`, {
        headers: {
          'X-Admin-Token': 'dev-admin', // This should come from user's session
        },
      });

      if (response.ok) {
        const backendUsers = await response.json();
        // Transform backend users to match our frontend format
        const transformedUsers = backendUsers.map((user: any) => ({
          id: user.id,
          email: user.username,
          role: user.role,
          lastLogin: 'Never', // Backend doesn't have this yet
          status: 'active',
        }));
        setUsers(transformedUsers);
      } else {
        console.error('Failed to fetch users from backend');
        // Keep mock users as fallback
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Keep mock users as fallback
    }
  };

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

    // Fetch users from backend
    fetchUsers();
    setIsLoading(false);
  }, [router]);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = async () => {
    if (!newUser.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/db/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': 'dev-admin', // This should come from user's session
        },
        body: JSON.stringify({
          email: newUser.email,
          role: newUser.role,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add the new user to the local state
        const newUserObj = {
          id: result.id || Date.now(),
          email: newUser.email,
          role: newUser.role,
          lastLogin: 'Never',
          status: 'active',
        };
        
        setUsers([...users, newUserObj]);
        setNewUser({ email: '', role: 'user' });
        setIsDialogOpen(false);
        
        // Refresh users list from backend
        fetchUsers();
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create user');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to create user',
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'active' ? 'disabled' : 'active',
            }
          : user
      )
    );
  };

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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account. The user will receive an email with
                    login instructions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      className="rounded-md border p-2"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    onClick={handleCreateUser}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-green-700/20 dark:text-red-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this user? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}