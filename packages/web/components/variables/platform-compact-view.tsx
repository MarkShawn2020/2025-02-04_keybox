'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Plus, MoreVertical, Trash2 } from 'lucide-react';
import type { Platform } from '@keybox/shared';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { KeyCreationTrigger } from './key-creation-flow/trigger';
import { CompactKeyValue } from './key-value-compact';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSetAtom } from 'jotai';
import { deletePlatformAtom } from '@/atoms/localStorage';
import { cn } from '@/lib/utils';

interface PlatformCompactViewProps {
  platform: Platform;
  showRevokedKeys: boolean;
}

export function PlatformCompactView({ platform, showRevokedKeys }: PlatformCompactViewProps) {
  const deletePlatform = useSetAtom(deletePlatformAtom);
  const { toast } = useToast();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const keyGroups = platform.key_groups || [];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Count total keys
  const totalKeys = keyGroups.reduce((acc, group) => 
    acc + (group.keys?.filter(k => showRevokedKeys || !k.revoked).length || 0), 0
  );

  return (
    <Card className="hover:shadow-sm transition-shadow h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">{platform.name}</CardTitle>
            {totalKeys > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {totalKeys}
              </Badge>
            )}
          </div>
          <div className="flex gap-0.5">
            <KeyCreationTrigger
              startStep="key-name"
              platformId={platform.id}
            >
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-3 w-3" />
              </Button>
            </KeyCreationTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
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
                  className="text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {platform.description && (
          <p className="text-xs text-muted-foreground mt-1">{platform.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="pt-1 pb-2 flex-1 overflow-auto">
        {keyGroups.length > 0 ? (
          <div className="space-y-1">
            {keyGroups.map(group => {
              const isExpanded = expandedGroups.has(group.id);
              const visibleKeys = group.keys?.filter(k => showRevokedKeys || !k.revoked) || [];
              
              if (visibleKeys.length === 0) return null;
              
              return (
                <div key={group.id} className="overflow-hidden">
                  {/* Group Header */}
                  <div
                    className="flex items-center gap-1.5 py-1 px-2 -mx-2 cursor-pointer hover:bg-muted/30 rounded transition-colors"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <ChevronDown 
                      className={cn(
                        "h-3 w-3 text-muted-foreground transition-transform shrink-0",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                    <span className="text-xs font-medium truncate">{group.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {visibleKeys.length}
                    </span>
                  </div>
                  
                  {/* Expanded Keys */}
                  {isExpanded && (
                    <div className="ml-4 border-l">
                      {visibleKeys.map(key => (
                        <CompactKeyValue
                          key={key.id}
                          keyData={key}
                          keyName={group.name}
                          platformId={platform.id}
                          groupId={group.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-3">
            No variables yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}