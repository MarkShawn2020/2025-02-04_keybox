'use client';

import { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useToast } from '@/hooks/use-toast';
import { BaseDialog } from '@/components/ui/base-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';
import { addKeyGroupAtom, platformsAtom } from '@/atoms/localStorage';

const dangerousTags = ['server'] as const;
const primaryTags = ['client'] as const;
const defaultTags = [...dangerousTags, ...primaryTags] as const;

export function KeyNameDialog() {
  const [flowState, setFlowState] = useAtom(keyCreationFlowAtom);
  const { toast } = useToast();
  const addKeyGroup = useSetAtom(addKeyGroupAtom);
  const [platforms] = useAtom(platformsAtom);
  const [isPending, setIsPending] = useState(false);
  
  const platform = platforms.find(p => p.id === flowState.platformId);  

  // 表单状态
  const [name, setName] = useState('');
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (platform?.name && !name && !init) {
      setName(`${platform.name.toUpperCase()}_API_KEY`);
      setInit(true)
    }
  }, [platform?.name, name]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [specialTags, setSpecialTags] = useState<Record<string, boolean>>(
    defaultTags.reduce((acc, tag) => ({ ...acc, [tag]: false }), {})
  );

  const handleClose = () => {
    setFlowState(prev => ({
      ...prev,
      isOpen: false,
      groupId: undefined,
    }));
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag) && !defaultTags.includes(newTag as any)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a Key Name',
        variant: 'destructive',
      });
      return;
    }

    if (!flowState.platformId) {
      toast({
        title: 'Error',
        description: 'Platform ID is required',
        variant: 'destructive',
      });
      return;
    }

    const finalTags = [
      ...Object.entries(specialTags)
        .filter(([_, checked]) => checked)
        .map(([tag]) => tag),
      ...tags.filter(tag => !defaultTags.includes(tag as any))
    ];

    setIsPending(true);
    try {
      const newGroup = addKeyGroup({
        platformId: flowState.platformId,
        keyGroup: {
          name,
          description: description || undefined,
          tags: finalTags,
        }
      });
      
      setFlowState(prev => ({
        ...prev,
        groupId: newGroup.id,
        step: 'key-value'
      }));
      
      toast({
        title: 'Success',
        description: 'Key Name created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <BaseDialog
      open={flowState.isOpen && flowState.step === 'key-name'}
      onOpenChange={(open) => !open && handleClose()}
      title="Create New Key Name"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {defaultTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={specialTags[tag]}
                  onCheckedChange={(checked) =>
                    setSpecialTags(prev => ({ ...prev, [tag]: !!checked }))
                  }
                  disabled={isPending}
                />
                <label
                  htmlFor={tag}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              disabled={isPending}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddTag}
              disabled={!newTag || isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="space-x-1">
                <span>{tag}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </BaseDialog>
  );
}
