'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Pencil, Tag as TagIcon, Plus, X } from 'lucide-react';
import type { KeyGroup } from '@keybox/shared';
import { useUpdateKeyGroup } from '@/hooks/usePlatforms';

const dangerousTags = ["server"] as string[];
const defaultTags = [...dangerousTags, 'client'] as string[];

interface EditKeyGroupDialogProps {
  group: KeyGroup;
}

export function EditKeyGroupDialog({ group }: EditKeyGroupDialogProps) {
  const { mutate: updateGroup } = useUpdateKeyGroup();
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [editDescription, setEditDescription] = useState(group.description || '');
  const [editTags, setEditTags] = useState<string[]>(group.tags || []);
  const [newTag, setNewTag] = useState('');
  const [specialTags, setSpecialTags] = useState<Record<string, boolean>>(
    defaultTags.reduce((acc, tag) => ({
      ...acc,
      [tag]: (group.tags || []).includes(tag)
    }), {})
  );

  const handleSubmit = () => {
    if (!editName.trim()) {
      return;
    }

    const finalTags = [
      ...Object.entries(specialTags)
        .filter(([_, checked]) => checked)
        .map(([tag]) => tag),
      ...editTags.filter(tag => !defaultTags.includes(tag as any))
    ];

    updateGroup({ 
      groupId: group.id, 
      data: {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        tags: finalTags.length > 0 ? finalTags : undefined,
      }
    }, {
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  };

  const handleCancel = () => {
    setEditName(group.name);
    setEditDescription(group.description || '');
    setEditTags(group.tags || []);
    setSpecialTags(defaultTags.reduce((acc, tag) => ({
      ...acc,
      [tag]: (group.tags || []).includes(tag)
    }), {}));
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Key Group</DialogTitle>
            <DialogDescription>
              Make changes to your key group. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                Name
                <span className="text-xs text-muted-foreground">(required)</span>
              </label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Group name"
                className="font-medium"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                Description
                <span className="text-xs text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add a description to help you remember what this group is for"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                Tags
              </label>
              
              <div className="space-y-4">
                <div className="flex gap-6 px-4 py-2 bg-muted rounded-lg">
                  {defaultTags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={specialTags[tag]}
                        onCheckedChange={(checked) => {
                          setSpecialTags(prev => ({ ...prev, [tag]: !!checked }));
                        }}
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className={`text-sm font-medium leading-none ${dangerousTags.includes(tag) ? 'text-destructive' : ''}`}
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {editTags.filter(tag => !defaultTags.includes(tag as any)).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => {
                            setEditTags(editTags.filter((_, i) => i !== index));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          e.preventDefault();
                          if (!editTags.includes(newTag.trim()) && !defaultTags.includes(newTag.trim() as any)) {
                            setEditTags([...editTags, newTag.trim()]);
                            setNewTag('');
                          }
                        }
                      }}
                      className="h-8"
                      placeholder="Add custom tag"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (newTag.trim() && !editTags.includes(newTag.trim()) && !defaultTags.includes(newTag.trim() as any)) {
                          setEditTags([...editTags, newTag.trim()]);
                          setNewTag('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!editName.trim()}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
