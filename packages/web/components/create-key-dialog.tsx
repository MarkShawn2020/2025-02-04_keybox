'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CreateKeyDialogProps = {
  onKeyCreated: () => void;
};

export function CreateKeyDialog({ onKeyCreated }: CreateKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      value: formData.get('value') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create environment variable');
      }

      toast({
        title: 'Success',
        description: 'Environment variable created successfully',
      });
      
      setOpen(false);
      onKeyCreated();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Environment Variable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="DATABASE_URL"
              required
            />
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              type="password"
              placeholder="postgres://user:pass@localhost:5432/db"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Database connection string for the application"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="database, production"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
