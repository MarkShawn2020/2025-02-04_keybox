'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ChevronDown, ChevronRight, Trash2, Pencil, Check, X, Tag as TagIcon, Plus } from 'lucide-react';
import { CreateKeyValueDialog } from './create-key-value-dialog';
import { KeyItem } from './key-item';
import type { KeyGroup } from '@keybox/shared';
import { useCreateKey, useDeleteKey, useDeleteKeyGroup, useToggleKeyStatus, useUpdateKeyGroup, useUpdateKeyNote } from '@/hooks/usePlatforms';

interface KeyGroupCardProps {
  group: KeyGroup;
  platformId: string;
}

export function KeyGroupCard({ group, platformId }: KeyGroupCardProps) {
  const { mutate: updateGroup } = useUpdateKeyGroup();
  const { mutate: deleteGroup } = useDeleteKeyGroup();
  const { mutate: createKey } = useCreateKey();
  const { mutate: updateNote } = useUpdateKeyNote();
  const { mutate: toggleKeyStatus } = useToggleKeyStatus();
  const { mutate: deleteKey } = useDeleteKey();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [editDescription, setEditDescription] = useState(group.description || '');
  const [editTags, setEditTags] = useState<string[]>(group.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const defaultTags = ['server', 'client'] as const;
  const [specialTags, setSpecialTags] = useState<Record<string, boolean>>(
    defaultTags.reduce((acc, tag) => ({
      ...acc,
      [tag]: (group.tags || []).includes(tag)
    }), {})
  );

  return (
    <div className="p-2 pl-4">
      <div 
        className="flex items-center justify-between hover:bg-muted/30 transition-colors"
        onClick={() => !isEditing && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 flex-1">
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4 text-muted-foreground" /> : 
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
          <div className="flex items-center gap-2 flex-1">
            {isEditing ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-[200px]"
                  placeholder="Group name"
                />
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1"
                  placeholder="Description (optional)"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-4">
                      {defaultTags.map((tag) => (
                        <div key={tag} className="flex items-center gap-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={specialTags[tag]}
                            onCheckedChange={(checked) => {
                              setSpecialTags(prev => ({ ...prev, [tag]: !!checked }));
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <label
                            htmlFor={`tag-${tag}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {editTags.filter(tag => !defaultTags.includes(tag as any)).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTags(editTags.filter((_, i) => i !== index));
                          }}
                        />
                      </Badge>
                    ))}
                    <div className="flex items-center gap-1">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTag.trim()) {
                            e.preventDefault();
                            setEditTags([...editTags, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-6 w-24"
                        placeholder="Add tag"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (newTag.trim()) {
                            setEditTags([...editTags, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.name}</span>
                {group.tags && group.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <TagIcon className="h-3 w-3 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {group.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant={defaultTags.includes(tag as any) ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={async (e) => {
                  e.stopPropagation();
                  const finalTags = [
                    ...Object.entries(specialTags)
                      .filter(([_, checked]) => checked)
                      .map(([tag]) => tag),
                    ...editTags.filter(tag => !defaultTags.includes(tag as any))
                  ];
                  updateGroup({ 
                    groupId: group.id, 
                    data: {
                      name: editName,
                      description: editDescription || undefined,
                      tags: finalTags.length > 0 ? finalTags : undefined,
                    }
                  });
                  setIsEditing(false);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditName(group.name);
                  setEditDescription(group.description || '');
                  setEditTags(group.tags || []);
                  setSpecialTags(defaultTags.reduce((acc, tag) => ({
                    ...acc,
                    [tag]: (group.tags || []).includes(tag)
                  }), {}));
                  setIsEditing(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <CreateKeyValueDialog 
                platformId={platformId}
                groupId={group.id}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteGroup(group.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-1 mt-2" style={{ display: isCollapsed ? 'none' : 'block' }}>
        {group.keys?.map((key) => (
          <KeyItem
            key={key.id}
            keyData={key}
            onUpdateNote={(keyId, note) => {
              updateNote({ keyId, note })
            }}
            onToggleStatus={(keyId) => {
              toggleKeyStatus(keyId)
            }}
            onDelete={(keyId) => {
              deleteKey(keyId)
            }}
          />
        ))}
      </div>
    </div>
  );
}
