'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Key, Plus, Settings, Trash2 } from 'lucide-react';
import type { Platform } from '@keybox/shared';
import { useDeletePlatform } from '@/hooks/usePlatforms';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { KeyCreationTrigger } from './key-creation-flow/trigger';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

interface PlatformCompactViewProps {
  platform: Platform;
  showRevokedKeys: boolean;
}

export function PlatformCompactView({ platform, showRevokedKeys }: PlatformCompactViewProps) {
  const { mutate: deletePlatform } = useDeletePlatform();
  const { toast } = useToast();
  const router = useRouter();
  const [showKeysPreview, setShowKeysPreview] = useState(false);
  
  // Count total active/revoked keys across all groups
  const keyStats = platform.key_groups?.reduce(
    (acc, group) => {
      const active = group.keys?.filter(k => !k.revoked)?.length || 0;
      const revoked = group.keys?.filter(k => k.revoked)?.length || 0;
      
      return {
        total: acc.total + (group.keys?.length || 0),
        active: acc.active + active,
        revoked: acc.revoked + revoked
      };
    },
    { total: 0, active: 0, revoked: 0 }
  ) || { total: 0, active: 0, revoked: 0 };
  
  // Get all key groups
  const keyGroups = platform.key_groups || [];
  
  // Get list of unique tags across all key groups
  const allTags = keyGroups.reduce((acc, group) => {
    if (group.tags && group.tags.length > 0) {
      group.tags.forEach(tag => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
    }
    return acc;
  }, [] as string[]);

  const dangerousTags = ["server"] as const;

  const handleDetailsClick = () => {
    // Navigate to a detailed view for this platform
    // This would require implementing a platform details page
    // For now, we'll just toggle the keys preview
    setShowKeysPreview(!showKeysPreview);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-3">
        <CardTitle className="text-base flex items-center gap-2">
          {platform.name}
        </CardTitle>
        <div className="flex items-center gap-1">
          <KeyCreationTrigger
            startStep="key-name"
            platformId={platform.id}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </KeyCreationTrigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
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
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Platform
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 flex flex-col flex-1 gap-2">
        {/* Platform description */}
        {platform.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{platform.description}</p>
        )}
        
        {/* Key stats summary */}
        <div className="flex items-center gap-2 mt-1">
          <div className="bg-muted px-2 py-1 rounded-md flex items-center gap-1">
            <Key className="h-3 w-3" />
            <span className="text-xs">{keyStats.active} active</span>
          </div>
          {keyStats.revoked > 0 && showRevokedKeys && (
            <div className="bg-muted/50 px-2 py-1 rounded-md flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{keyStats.revoked} revoked</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {allTags.map((tag, idx) => (
              <Badge
                key={idx}
                variant={dangerousTags.includes(tag as any) ? "default" : "secondary"}
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Key Groups Preview */}
        {showKeysPreview && keyGroups.length > 0 && (
          <div className="mt-2 space-y-2 pt-2 border-t">
            <h4 className="text-xs font-medium">Key Groups</h4>
            <div className="space-y-1">
              {keyGroups.map(group => (
                <div key={group.id} className="text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span>{group.name}</span>
                    <span className="text-muted-foreground">
                      ({(group.keys?.filter(k => !k.revoked).length || 0)} keys)
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            const keys = group.keys?.filter(k => !k.revoked).map(k => k.value).join(', ');
                            if (keys) {
                              navigator.clipboard.writeText(keys);
                              toast({
                                title: 'Copied!',
                                description: `Values for ${group.name} copied to clipboard`,
                              });
                            }
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy all active values</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action buttons at the bottom */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {keyGroups.length} groups
          </div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={handleDetailsClick}
            >
              {showKeysPreview ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  <span className="text-xs">Hide Details</span>
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="text-xs">Show Details</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
