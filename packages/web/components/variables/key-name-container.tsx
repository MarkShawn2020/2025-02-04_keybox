'use client';

import {useDeleteKey, useUpdateKeyName} from '@/hooks/usePlatforms';
import type {KeyName} from '@keybox/shared';
import {ChevronDown, ChevronRight, Trash2} from 'lucide-react';
import {useState} from 'react';
import {CreateKeyValueDialog} from './create-key-value-dialog';
import {KeyNameDialog} from './key-name-dialog';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import { KeyValue } from './key-value-container';

interface KeyNameCardProps {
  group: KeyName;
  platformId: string;
  showRevokedKeys: boolean;
}

const dangerousTags = ["server"] as const
const defaultTags = [...dangerousTags, 'client'] as const;

export function KeyNameCard({group, platformId, showRevokedKeys}: KeyNameCardProps) {
  const {mutate: deleteGroup} = useDeleteKey();
  const {mutate: updateGroup} = useUpdateKeyName();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-2 pl-4">
      <div
        className="flex items-center justify-between hover:bg-muted/30 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 flex-1">
          {isCollapsed ?
            <ChevronRight className="h-4 w-4 text-muted-foreground"/> :
            <ChevronDown className="h-4 w-4 text-muted-foreground"/>
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
                          variant={dangerousTags.includes(tag as any) ? "default" : "secondary"}
                          className={`text-xs ${defaultTags.includes(tag as any) ? 'hover:bg-destructive/80' : ''}`}
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
              onSuccess={() => updateGroup({
                groupId: group.id,
                data: {name: group.name, description: group.description, tags: group.tags}
              })}
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
              <Trash2 className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mt-2" style={{display: isCollapsed ? 'none' : 'block'}}>
        {group.keys
          ?.filter(key => showRevokedKeys || !key.revoked)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map((key) => (
          <KeyValue
            key={key.id}
            keyData={key}
          />
        ))}
      </div>
    </div>
  );
}
