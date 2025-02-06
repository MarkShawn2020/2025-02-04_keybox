'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { CreateKeyValueDialog } from './create-key-value-dialog';
import { KeyNameDialog } from './key-group-dialog';
import { KeyItem } from './key-item';
import type { KeyName } from '@keybox/shared';
import { useDeleteKey, useToggleKeyStatus, useUpdateKeyNote, useUpdateKeyName } from '@/hooks/usePlatforms';

interface KeyNameCardProps {
  group: KeyName;
  platformId: string;
}

const dangerousTags = ["server"] as const
const defaultTags = [...dangerousTags, 'client'] as const;

export function KeyNameCard({ group, platformId }: KeyNameCardProps) {
  const { mutate: deleteGroup } = useDeleteKey();
  const { mutate: updateGroup } = useUpdateKeyName();
  const { mutate: updateNote } = useUpdateKeyNote();
  const { mutate: toggleKeyStatus } = useToggleKeyStatus();
  const { mutate: deleteKey } = useDeleteKey();

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="p-2 pl-4">
      <div 
        className="flex items-center justify-between hover:bg-muted/30 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 flex-1">
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4 text-muted-foreground" /> : 
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
          <div className="flex items-center gap-2 flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.name}</span>
                {group.tags && group.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex flex-wrap gap-1">
                      {group.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant={dangerousTags.includes(tag as any) ? "destructive" : "secondary"} 
                          className={`text-xs ${defaultTags.includes(tag as any) ? 'hover:bg-destructive/80' : ''}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {group.description && (
                <p className="text-sm text-muted-foreground">{group.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1"
          >
            <KeyNameDialog 
              mode="edit"
              group={group} 
              onSuccess={() => updateGroup({ groupId: group.id, data: { name: group.name, description: group.description, tags: group.tags } })}
            />
            <CreateKeyValueDialog 
              platformId={platformId}
              groupId={group.id}
            />
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm('Are you sure you want to delete this Key Name?')) {
                  deleteGroup(group.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mt-2" style={{ display: isCollapsed ? 'none' : 'block' }}>
        {group.keys?.map((key) => (
          <KeyItem
            key={key.id}
            keyData={key}
          />
        ))}
      </div>
    </div>
  );
}
