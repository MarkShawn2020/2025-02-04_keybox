'use client';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Key, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

type Key = {
  id: string;
  name: string;
  value: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
};

export function KeysList() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const toggleValueVisibility = (id: string) => {
    setShowValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Value copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid gap-4">
        {keys.map((key) => (
          <Card key={key.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">{key.name}</Label>
                </div>
                {key.description && (
                  <p className="text-sm text-muted-foreground">{key.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleValueVisibility(key.id)}
                >
                  {showValues[key.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(key.value)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <Input
                type={showValues[key.id] ? 'text' : 'password'}
                value={key.value}
                readOnly
                className="font-mono"
              />
            </div>
            {key.tags && key.tags.length > 0 && (
              <div className="mt-2 flex gap-2">
                {key.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
