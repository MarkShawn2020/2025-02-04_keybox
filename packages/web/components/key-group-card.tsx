'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { CreateKeyValueDialog } from './create-key-value-dialog';
import { KeyItem } from './key-item';
import type { KeyGroup } from '@keybox/shared';

interface KeyGroupCardProps {
  group: KeyGroup;
  platformId: string;
  onKeyCreated: () => Promise<void>;
  onUpdateNote: (keyId: string, note: string) => Promise<void>;
  onToggleKeyStatus: (keyId: string) => Promise<void>;
  onDeleteKey: (keyId: string) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
}

export function KeyGroupCard({ 
  group, 
  platformId,
  onKeyCreated,
  onUpdateNote,
  onToggleKeyStatus,
  onDeleteKey,
  onDeleteGroup,
}: KeyGroupCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="p-2 pl-4">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4 text-muted-foreground" /> : 
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
          <div className="flex items-center gap-2">
            <span className="font-medium">{group.name}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(group.created_at).toLocaleDateString()}
            </span>
          </div>
          {group.description && (
            <p className="text-sm text-muted-foreground">{group.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <CreateKeyValueDialog 
            onKeyCreated={onKeyCreated}
            platformId={platformId}
            groupId={group.id}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGroup(group.id);
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
            onUpdateNote={onUpdateNote}
            onToggleStatus={onToggleKeyStatus}
            onDelete={onDeleteKey}
          />
        ))}
      </div>
    </div>
  );
}
