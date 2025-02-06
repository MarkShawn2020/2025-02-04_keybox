'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreatePlatform, useCreateKeyGroup, useCreateKey } from '@/hooks/usePlatforms';

export function CreateKeyDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'platform' | 'group' | 'key'>('platform');
  const [platformId, setPlatformId] = useState<string>();
  const [groupId, setGroupId] = useState<string>();

  const { toast } = useToast();

  const { mutate: createPlatform, isPending: isCreatingPlatform } = useCreatePlatform();

  const handlePlatformSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
    };

    createPlatform({ data }, {
      onSuccess: (platform) => {
        if (platform && typeof platform === 'object' && 'id' in platform && typeof platform.id === 'string') {
          setPlatformId(platform.id);
          setStep('group');
        }
        setStep('group');
        toast({
          title: 'Success',
          description: 'Platform created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const { mutate: createKeyGroup, isPending: isCreatingGroup } = useCreateKeyGroup();

  const handleGroupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      platformId: platformId!,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    };

    createKeyGroup({ platformId: platformId!, data: {
      name: data.name,
      description: data.description,
    }}, {
      onSuccess: (group) => {
        if (group && typeof group === 'object' && 'id' in group && typeof group.id === 'string') {
          setGroupId(group.id);
          setStep('key');
        }
        setStep('key');
        toast({
          title: 'Success',
          description: 'Key group created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const { mutate: createKey, isPending: isCreatingKey } = useCreateKey();

  const handleKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      value: formData.get('value') as string,
      note: formData.get('note') as string || undefined,
    };

    createKey({
      groupId: groupId!,
      data,
    }, {
      onSuccess: () => {
        setOpen(false);
        toast({
          title: 'Success',
          description: 'Key created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleClose = () => {
    setStep('platform');
    setPlatformId(undefined);
    setGroupId(undefined);
    setOpen(false);
  };

  return (
    <Dialog 
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        } else {
          setOpen(true);
          setStep('platform');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
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
            <Button type="submit" disabled={isCreatingPlatform}>
              {isCreatingPlatform ? 'Creating...' : 'Next'}
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
            <Button type="submit" disabled={isCreatingGroup}>
              {isCreatingGroup ? 'Creating...' : 'Next'}
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
              <Button type="submit" disabled={isCreatingKey}>
                {isCreatingKey ? 'Creating...' : 'Create'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                disabled={isCreatingPlatform}
                onClick={() => {
                  // 先重置状态
                  setStep('platform');
                  setPlatformId(undefined);
                  setGroupId(undefined);
                  setOpen(false);
                  
                  // 显示提示
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
