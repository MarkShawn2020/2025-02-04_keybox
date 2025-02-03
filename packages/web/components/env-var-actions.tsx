'use client';

import { Button } from './ui/button';
import { Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export function EnvVarActions() {
  const { toast } = useToast();

  const handleExport = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/export`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to export environment variables');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '.env';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: 'Environment variables exported successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/import`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to import environment variables');

      const result = await response.json();
      toast({
        title: 'Success',
        description: `Imported ${result.length} environment variables`,
      });

      // Reset the input
      event.target.value = '';
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleExport}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      
      <label className="cursor-pointer">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          asChild
        >
          <span>
            <Upload className="h-4 w-4" />
            Import
          </span>
        </Button>
        <input
          type="file"
          accept=".env"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
