'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
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

export default function UploadDatasetPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];
    
    if (!file.name.endsWith('.csv')) {
      errors.push('File must be in CSV format');
    }
    
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size must be less than 10MB');
    }
    
    return errors;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const errors = validateFile(droppedFile);
    setValidationErrors(errors);

    if (errors.length === 0) {
      setFile(droppedFile);
      // Simulate file preview
      setPreview([
        { date: '2024-01-01', open: 150.25, close: 151.50, volume: 1000000 },
        { date: '2024-01-02', open: 151.75, close: 152.25, volume: 1200000 },
        { date: '2024-01-03', open: 152.50, close: 151.75, volume: 900000 },
      ]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const errors = validateFile(selectedFile);
    setValidationErrors(errors);

    if (errors.length === 0) {
      setFile(selectedFile);
      // Simulate file preview
      setPreview([
        { date: '2024-01-01', open: 150.25, close: 151.50, volume: 1000000 },
        { date: '2024-01-02', open: 151.75, close: 152.25, volume: 1200000 },
        { date: '2024-01-03', open: 152.50, close: 151.75, volume: 900000 },
      ]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    toast({
      title: 'Upload Complete',
      description: 'Dataset has been successfully uploaded.',
    });
  };

  const handleRetrain = async () => {
    toast({
      title: 'Model Retraining Started',
      description: 'The model is being retrained with the new dataset.',
    });
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
          <h1 className="text-3xl font-bold">Upload Dataset</h1>
          <p className="text-muted-foreground">
            Upload new training data for the prediction model
          </p>
        </div>

        <Card className="p-6">
          <div
            className={`mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border bg-background'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              Drag and drop your dataset here
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              or click to select a file
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="mt-4"
            />
          </div>

          {validationErrors.length > 0 && (
            <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <h4 className="font-semibold text-destructive">
                  Validation Errors
                </h4>
              </div>
              <ul className="mt-2 list-inside list-disc text-sm text-destructive">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {file && (
            <>
              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Upload Progress</h3>
                <Progress value={uploadProgress} className="h-2" />
                {uploadProgress === 100 && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <Check className="mr-1 inline-block h-4 w-4" />
                    Upload complete
                  </p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-4 font-semibold">Data Preview</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Open</TableHead>
                      <TableHead>Close</TableHead>
                      <TableHead>Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.open}</TableCell>
                        <TableCell>{row.close}</TableCell>
                        <TableCell>{row.volume}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleUpload} disabled={uploadProgress > 0}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Dataset
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      disabled={uploadProgress < 100}
                    >
                      Retrain Model
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Retrain Model</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to retrain the model with the new
                        dataset? This process may take several minutes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRetrain}>
                        Start Training
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}