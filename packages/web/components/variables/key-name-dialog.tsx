'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Pencil, Tag as TagIcon, Plus, X } from 'lucide-react';
import type { KeyName } from '@keybox/shared';
import { useCreateKeyName, useUpdateKeyName } from '@/hooks/usePlatforms';
import { useToast } from '@/hooks/use-toast';

const dangerousTags = ['server'] as const;
const primaryTags = ['client'] as const;
const defaultTags = [...dangerousTags, ...primaryTags] as const;

interface KeyNameDialogProps {
  mode: 'create' | 'edit';
  platformId?: string;  // 仅创建模式需要
  group?: KeyName;     // 仅编辑模式需要
  onSuccess?: (data: { name: string; description?: string; tags?: string[]; groupId?: string }) => void;
  /** 是否只渲染对话框内容，不包含触发按钮和对话框容器 */
  renderContent?: boolean;
}

export function KeyNameDialog({ mode, platformId, group, onSuccess, renderContent }: KeyNameDialogProps) {
  const { mutateAsync: createKeyName } = useCreateKeyName();
  const { mutateAsync: updateKeyName } = useUpdateKeyName();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 表单状态
  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [tags, setTags] = useState<string[]>(group?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [specialTags, setSpecialTags] = useState<Record<string, boolean>>(
    defaultTags.reduce((acc, tag) => ({
      ...acc,
      [tag]: (group?.tags || []).includes(tag)
    }), {})
  );

  // 当作为内容渲染时，直接使用 loading 状态
  const isLoading = renderContent ? loading : false;
  const shouldDisableForm = renderContent ? loading : !isOpen;

  const resetForm = () => {
    if (mode === 'create') {
      setName('');
      setDescription('');
      setTags([]);
      setNewTag('');
      setSpecialTags(defaultTags.reduce((acc, tag) => ({ ...acc, [tag]: false }), {}));
    } else {
      setName(group?.name || '');
      setDescription(group?.description || '');
      setTags(group?.tags || []);
      setNewTag('');
      setSpecialTags(defaultTags.reduce((acc, tag) => ({
        ...acc,
        [tag]: (group?.tags || []).includes(tag)
      }), {}));
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (shouldDisableForm) return;
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a Key Name',
        variant: 'destructive',
      });
      return;
    }

    if (mode === 'create' && !platformId) {
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

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      tags: finalTags.length > 0 ? finalTags : undefined,
    };

    setLoading(true);
    try {
      if (mode === 'create') {
        const result = await createKeyName({
          platformId: platformId!,
          data
        });
        toast({
          title: 'Success',
          description: 'Key Name created successfully',
        });
        onSuccess?.({ ...data, groupId: result.groupId! });
      } else {
        await updateKeyName({
          groupId: group!.id,
          data
        });
        toast({
          title: 'Success',
          description: 'Key Name updated successfully',
        });
      }
      if (renderContent) {
        resetForm();
      } else {
        handleClose();
      }
    } catch (error: any) {
      console.error('Error handling Key Name:', error);
      const errorMessage = error?.message || 
        (error?.cause?.message) || 
        JSON.stringify(error) || 
        `Failed to ${mode} Key Name`;
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag) && !defaultTags.includes(newTag as any)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const dialogContent = (
    <div className="space-y-4">
      {!renderContent && (
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Key Name' : 'Edit Key Name'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a new Key Name to organize your environment variables.'
              : 'Make changes to your Key Name. Click save when you\'re done.'}
          </DialogDescription>
        </DialogHeader>
      )}
          
          <form id="key-group-form" onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                Name
                <span className="text-xs text-muted-foreground">(required)</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Key Name"
                className="font-medium"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="resize-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                {defaultTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={specialTags[tag]}
                      onCheckedChange={(checked) => 
                        setSpecialTags(prev => ({ ...prev, [tag]: !!checked }))
                      }
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

            <div className="grid gap-2">
              <label className="text-sm font-medium">Custom Tags</label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add custom tag..."
                />
                <Button type="button" onClick={addTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.filter(tag => !defaultTags.includes(tag as any)).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                type="submit"
                disabled={shouldDisableForm}
                className='w-full'
              >
                {loading ? 'Loading...' : (mode === 'create' ? 'Next' : 'Save')}
              </Button>
            </div>
          </form>
    </div>
  );

  if (renderContent) {
    return dialogContent;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        {mode === 'create' ? (
          <Plus className="h-4 w-4" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {dialogContent}
        </DialogContent>
      </Dialog>
    </>
  );
}
