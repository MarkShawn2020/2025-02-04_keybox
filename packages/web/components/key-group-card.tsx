'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronDown, ChevronRight, Trash2, Pencil, Check, X } from 'lucide-react';
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
  onUpdateGroup: (groupId: string, data: { name: string; description?: string }) => Promise<void>;
}

export function KeyGroupCard({ 
  group, 
  platformId,
  onKeyCreated,
  onUpdateNote,
  onToggleKeyStatus,
  onDeleteKey,
  onDeleteGroup,
  onUpdateGroup,
}: KeyGroupCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [editDescription, setEditDescription] = useState(group.description || '');

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
              </div>
            ) : (
              <>
                <span className="font-medium">{group.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(group.created_at).toLocaleDateString()}
                </span>
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
              </>
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
                  await onUpdateGroup(group.id, {
                    name: editName,
                    description: editDescription || undefined,
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
            </>
          )}
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
