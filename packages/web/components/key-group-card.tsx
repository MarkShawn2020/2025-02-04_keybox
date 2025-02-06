'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { CreateKeyValueDialog } from './create-key-value-dialog';
import { EditKeyGroupDialog } from './edit-key-group-dialog';
import { KeyItem } from './key-item';
import type { KeyGroup } from '@keybox/shared';
import { useDeleteKey, useToggleKeyStatus, useUpdateKeyNote, useUpdateKeyGroup } from '@/hooks/usePlatforms';

interface KeyGroupCardProps {
  group: KeyGroup;
  platformId: string;
}

const dangerousTags = ["server"] as const
const defaultTags = [...dangerousTags, 'client'] as const;

export function KeyGroupCard({ group, platformId }: KeyGroupCardProps) {
  const { mutate: deleteGroup } = useDeleteKey();
  const { mutate: updateGroup } = useUpdateKeyGroup();
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

        <div className="flex items-center gap-1">
          <EditKeyGroupDialog 
            group={group} 
            onUpdate={(data: { name: string; description?: string }) => updateGroup({ groupId: group.id, data })}
          />
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
