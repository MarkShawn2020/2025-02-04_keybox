'use client';

import {KeyNameCard} from "@/components/variables/key-name-container";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Plus, Trash2, Package, Sparkles } from 'lucide-react';
import { KeyCreationTrigger } from './key-creation-flow/trigger';
import type { Platform } from '@keybox/shared';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useSetAtom } from 'jotai';
import { deletePlatformAtom } from '@/atoms/localStorage';
import { VariableGroupCard } from './variable-group-card';
import { Badge } from '@/components/ui/badge';
import { useVariableGroups, useTemplateSuggestion } from '@/hooks/use-variable-groups';

interface PlatformCardProps {
  platform: Platform;
  showRevokedKeys: boolean;
}

export function PlatformContainer({ platform, showRevokedKeys }: PlatformCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const deletePlatform = useSetAtom(deletePlatformAtom);
  const { toast: toastHook } = useToast();
  
  // Use the custom hooks for variable groups and template suggestions
  const { groups: variableGroups } = useVariableGroups(platform.id);
  const { suggestedTemplate } = useTemplateSuggestion(platform.id);

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
          {suggestedTemplate && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Template detected
            </Badge>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <KeyCreationTrigger
              startStep="key-name"
              platformId={platform.id}
            >
              <Button
                variant="ghost"
                size="icon"
                title="Add new variable"
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
                toastHook({
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
        {/* Show variable groups if any exist */}
        {variableGroups.length > 0 && (
          <div className="p-4 space-y-4 bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Service Configurations</span>
            </div>
            {variableGroups.map((group) => (
              <VariableGroupCard
                key={group.group.id}
                group={group}
                platformId={platform.id}
                onAddVariable={(groupId, variableName) => {
                  // Open key creation flow with pre-filled name
                  console.log('Add variable:', groupId, variableName);
                }}
              />
            ))}
          </div>
        )}
        
        {/* Show regular key groups */}
        {[...(platform.key_groups || [])]
          .filter(kg => !variableGroups.some(vg => 
            vg.keyGroups.some(k => k.id === kg.id)
          ))
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
