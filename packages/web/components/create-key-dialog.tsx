'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

type CreateKeyDialogProps = {
  onKeyCreated: () => void;
};

export function CreateKeyDialog({ onKeyCreated }: CreateKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'platform' | 'group' | 'key'>('platform');
  const [platformId, setPlatformId] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePlatformSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
    };

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/platforms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create platform');
      }

      const result = await response.json();
      setPlatformId(result.id);
      setStep('group');
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

  const handleGroupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/platforms/${platformId}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create key group');
      }

      const result = await response.json();
      setGroupId(result.id);
      setStep('key');
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

  const handleKeySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      value: formData.get('value') as string,
      note: formData.get('note') as string || undefined,
    };

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/groups/${groupId}/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create key');
      }

      toast({
        title: 'Success',
        description: 'Key created successfully',
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

  const handleClose = () => {
    setStep('platform');
    setPlatformId(undefined);
    setGroupId(undefined);
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={(open) => {
        if (!open) handleClose();
        else setOpen(true);
      }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'platform' && 'Add New Platform'}
            {step === 'group' && 'Add New Key Group'}
            {step === 'key' && 'Add New Key'}
          </DialogTitle>
        </DialogHeader>

        {step === 'platform' && (
          <form onSubmit={handlePlatformSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Platform Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="OPENAI"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">The name of the platform or service (e.g., OPENAI, AWS, ALICLOUD)</p>
            </div>
            <div>
              <Label htmlFor="description">Platform Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="OpenAI's API services"
              />
              <p className="text-sm text-muted-foreground mt-1">What this platform is used for</p>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="ai, ml, api"
              />
              <p className="text-sm text-muted-foreground mt-1">Optional tags for filtering and organization</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Next'}
            </Button>
          </form>
        )}

        {step === 'group' && (
          <form onSubmit={handleGroupSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Key Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="API_KEY"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">The environment variable name that will be used in your code</p>
            </div>
            <div>
              <Label htmlFor="description">Key Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="API keys for accessing OpenAI services"
              />
              <p className="text-sm text-muted-foreground mt-1">What this key is used for</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Next'}
            </Button>
          </form>
        )}

        {step === 'key' && (
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <Label htmlFor="value">Key Value</Label>
              <Input
                id="value"
                name="value"
                type="password"
                placeholder="sk-..."
                required
              />
              <p className="text-sm text-muted-foreground mt-1">The actual secret value</p>
            </div>
            <div>
              <Label htmlFor="note">Key Source/Owner</Label>
              <Input
                id="note"
                name="note"
                placeholder="From John (john@example.com)"
              />
              <p className="text-sm text-muted-foreground mt-1">Who provided this key or where it came from</p>
            </div>
            <div className="flex justify-between gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                disabled={loading}
                onClick={() => {
                  // 先重置状态
                  setStep('platform');
                  setPlatformId(undefined);
                  setGroupId(undefined);
                  setOpen(false);
                  
                  // 然后通知父组件和显示提示
                  onKeyCreated();
                  toast({
                    title: 'Success',
                    description: 'Key group created successfully (no key value added)',
                  });
                }}
              >
                Skip
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
