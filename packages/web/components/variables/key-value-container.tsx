'use client';

import {useToast} from "@/hooks/use-toast";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import type { Key } from '@keybox/shared';
import { useUpdateKeyNote, useToggleKeyStatus, useDeleteKey } from '@/hooks/usePlatforms';

interface KeyItemProps {
  keyData: Key;
}

export function KeyValue({ keyData }: KeyItemProps) {
  const [showValue, setShowValue] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(keyData.note || "");
  const { toast } = useToast();

  const { mutate: updateNote } = useUpdateKeyNote();
  const { mutate: toggleStatus } = useToggleKeyStatus();
  const { mutate: deleteKey } = useDeleteKey();

  const maskValue = (value: string) => {
    if (value.length <= 2) value = value.replace(/./g, '•');
    return `${value.slice(0, 2)}••••${value.slice(-2)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Value copied to clipboard',
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
    <div className="flex items-center justify-between py-1 pl-4">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={`px-1.5 py-0.5 text-xs rounded ${keyData.revoked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {keyData.revoked ? 'Revoked' : 'Active'}
        </span>

        <span className="text-xs text-muted-foreground">
          {new Date(keyData.created_at).toLocaleDateString()}
        </span>

        <div className="flex-1 min-w-0">
          {isEditingNote ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateNote({ keyId: keyData.id, note: noteValue });
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
                    updateNote({ keyId: keyData.id, note: noteValue });
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
          onClick={() => copyToClipboard(keyData.value)}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleStatus(keyData.id)}
          className={keyData.revoked ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
        >
          <span className="sr-only">{keyData.revoked ? 'Activate' : 'Revoke'} key</span>
          {keyData.revoked ? '🔓' : '🔒'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteKey(keyData.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
