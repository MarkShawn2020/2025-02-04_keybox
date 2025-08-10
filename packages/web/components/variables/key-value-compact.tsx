'use client';

import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, FileText } from 'lucide-react';
import type { Key } from '@keybox/shared';
import { cn } from '@/lib/utils';

interface CompactKeyItemProps {
  keyData: Key;
  keyName?: string;
  platformId: string;
  groupId: string;
}

export function CompactKeyValue({ keyData, keyName }: CompactKeyItemProps) {
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !isAltPressed) {
        setIsAltPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey && isAltPressed) {
        setIsAltPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isAltPressed]);

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: `${format} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn(
      "group flex items-center justify-between px-3 py-1.5 hover:bg-muted/50 transition-colors",
      keyData.revoked && "opacity-50"
    )}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[10px] text-muted-foreground/60">
          {new Date(keyData.created_at).toLocaleDateString()}
        </span>
        {keyData.note ? (
          <span className="text-xs text-muted-foreground truncate">
            {keyData.note}
          </span>
        ) : (
          <span className="text-xs font-mono text-muted-foreground">
            ••••
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity",
          isHovering && isAltPressed && keyName && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (e.altKey && keyName) {
            copyToClipboard(`${keyName}=${keyData.value}`, 'Key=Value');
          } else {
            copyToClipboard(keyData.value, 'Value');
          }
        }}
        title={keyName ? "Click to copy value, Option+Click to copy KEY=VALUE" : "Click to copy value"}
      >
        {isHovering && isAltPressed && keyName ? (
          <FileText className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}