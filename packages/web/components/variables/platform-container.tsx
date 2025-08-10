'use client';

import {KeyNameCard} from "@/components/variables/key-name-container";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { KeyCreationTrigger } from './key-creation-flow/trigger';
import type { Platform } from '@keybox/shared';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useSetAtom } from 'jotai';
import { deletePlatformAtom } from '@/atoms/localStorage';

interface PlatformCardProps {
  platform: Platform;
  showRevokedKeys: boolean;
}

export function PlatformContainer({ platform, showRevokedKeys }: PlatformCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const deletePlatform = useSetAtom(deletePlatformAtom);
  const { toast } = useToast();

  return (
    <div className="border rounded-lg">
      <div 
        className="flex items-center justify-between p-2 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors border-b"
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
        </div>
        <div className="flex items-center gap-2">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1"
          >
            <KeyCreationTrigger
              startStep="key-name"
              platformId={platform.id}
              
            >
                    <Button
        variant="ghost"
        size="icon"
      >
          <Plus className="h-4 w-4" />
      </Button>
              </KeyCreationTrigger>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toast({
                  title: 'Delete Platform',
                  description: 'Are you sure you want to delete this platform?',
                  action: (
                    <ToastAction
                      altText='delete platform'
                      onClick={() => deletePlatform(platform.id)}
                    >
                      Delete
                    </ToastAction>
                  ),
                  variant: 'destructive'
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="divide-y" style={{ display: isCollapsed ? 'none' : 'block' }}>
        {[...(platform.key_groups || [])]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((group) => (
            <KeyNameCard
              key={group.id}
              group={group}
              platformId={platform.id}
              showRevokedKeys={showRevokedKeys}
            />
          ))}
      </div>
    </div>
  );
}
