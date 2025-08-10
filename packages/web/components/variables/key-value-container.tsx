'use client';

import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Copy, Trash2, FileText } from 'lucide-react';
import type { Key } from '@keybox/shared';
import { useSetAtom } from 'jotai';
import { updateKeyNoteAtom, toggleKeyStatusAtom, deleteKeyAtom } from '@/atoms/localStorage';
import { cn } from '@/lib/utils';

interface KeyItemProps {
  keyData: Key;
  platformId: string;
  groupId: string;
  keyName?: string;
}



export function KeyValue({ keyData, platformId, groupId, keyName }: KeyItemProps) {
  const [showValue, setShowValue] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(keyData.note || "");
  const [isValid, setIsValid] = useState(!keyData.revoked);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  const updateNote = useSetAtom(updateKeyNoteAtom);
  const toggleStatus = useSetAtom(toggleKeyStatusAtom);
  const deleteKey = useSetAtom(deleteKeyAtom);

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

  const maskValue = (value: string) => {
    if (value.length <= 2) value = value.replace(/./g, '•');
    return `${value.slice(0, 2)}••••${value.slice(-2)}`;
  };

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
    <div className={`flex items-center justify-between py-1 pl-4 ${keyData.revoked ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Switch
          checked={isValid}
          onCheckedChange={(checked) => {
            setIsValid(checked);
            toggleStatus({ platformId, groupId, keyId: keyData.id });
          }}
          // className="h-4 w-7 data-[state=checked]:bg-primary/20 data-[state=unchecked]:bg-muted"
          // thumbClassName="h-3 w-3 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/50"
          aria-label="Toggle key validity"
        />

        <span className="text-xs text-muted-foreground">
          {new Date(keyData.created_at).toLocaleDateString()}
        </span>

        <div className="flex-1 min-w-0">
          {isEditingNote ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateNote({ platformId, groupId, keyId: keyData.id, note: noteValue });
                setIsEditingNote(false);
              }}
              className="flex items-center gap-1"
            >
              <Input
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                className="h-6 text-xs"
                autoFocus
                onBlur={() => {
                  if (noteValue !== keyData.note) {
                    updateNote({ platformId, groupId, keyId: keyData.id, note: noteValue });
                  }
                  setIsEditingNote(false);
                }}
              />
            </form>
          ) : (
            <div
              className="text-xs text-muted-foreground truncate cursor-text px-2 py-1 rounded border border-transparent hover:border-input hover:bg-accent/50 focus:border-input focus:bg-accent/50 transition-colors"
              onClick={() => {
                setIsEditingNote(true);
                setNoteValue(keyData.note || "");
              }}
            >
              <span className="flex items-center gap-1">
                {keyData.note || "Click to add note"}
              </span>
            </div>
          )}
        </div>

        <div className="w-32 overflow-hidden font-mono">
          <span className="text-sm text-muted-foreground">
            {showValue ? keyData.value : maskValue(keyData.value)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowValue(!showValue)}
        >
          {showValue ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={(e) => {
            // Check if Option/Alt key is pressed
            if (e.altKey && keyName) {
              // Copy in KEY=VALUE format
              copyToClipboard(`${keyName}=${keyData.value}`, 'Key=Value');
            } else {
              // Copy only the value
              copyToClipboard(keyData.value, 'Value');
            }
          }}
          className={cn(
            isHovering && isAltPressed && keyName && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
          title={keyName ? "Click to copy value, Option+Click to copy KEY=VALUE" : "Click to copy value"}
        >
          {isHovering && isAltPressed && keyName ? (
            <FileText className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteKey({ platformId, groupId, keyId: keyData.id })}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
