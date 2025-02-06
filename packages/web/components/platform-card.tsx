'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { CreateKeyGroupDialog } from './create-key-group-dialog';
import { KeyGroupCard } from './key-group-card';
import type { Platform } from '@keybox/shared';
import { useDeletePlatform } from '@/hooks/usePlatforms';

interface PlatformCardProps {
  platform: Platform;
}

export function PlatformCard({ platform }: PlatformCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mutate: deletePlatform } = useDeletePlatform();

  return (
    <div className="border rounded-lg">
      <div 
        className="flex items-center justify-between p-2 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4 text-muted-foreground" /> : 
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
          <div className="flex items-center gap-2">
            <span className="font-medium">{platform.name}</span>
          </div>
          {platform.description && (
            <p className="text-sm text-muted-foreground">{platform.description}</p>
          )}
          {platform.tags && platform.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {platform.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs rounded bg-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <CreateKeyGroupDialog 
            platformId={platform.id}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this platform?')) {
                deletePlatform(platform.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="divide-y" style={{ display: isCollapsed ? 'none' : 'block' }}>
        {[...(platform.key_groups || [])]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((group) => (
            <KeyGroupCard
              key={group.id}
              group={group}
              platformId={platform.id}
            />
          ))}
      </div>
    </div>
  );
}
