'use client';

import { Button } from './ui/button';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Key, Trash2, Copy, Eye, EyeOff, PencilIcon } from 'lucide-react';
import { CreateKeyDialog } from './create-key-dialog';
import { CreateKeyValueDialog } from './create-key-value-dialog';
import { CreateKeyGroupDialog } from './create-key-group-dialog';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../hooks/use-toast';
import { createClient } from '@/utils/supabase/client';


type Key = {
  id: string;
  value: string;
  note?: string;
  revoked: boolean;
  created_at: string;
  updated_at: string;
};

type KeyGroup = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  keys: Key[];
};

type Platform = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  key_groups: KeyGroup[];
};

export function KeysList() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [editingNote, setEditingNote] = useState<string>();
  const [noteValue, setNoteValue] = useState("");
  const { toast } = useToast();


  const fetchPlatforms = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch platforms');
      
      const data = await response.json();
      setPlatforms(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  const toggleValueVisibility = (id: string) => {
    setShowValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const deleteKey = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/keys/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete key');
      
      await fetchPlatforms();
      toast({
        title: 'Success',
        description: 'Key deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteKeyGroup = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/groups/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete key group');
      
      await fetchPlatforms();
      toast({
        title: 'Success',
        description: 'Key group deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateNote = async (keyId: string, note: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/keys/${keyId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note })
      });
      
      if (!response.ok) throw new Error('Failed to update note');
      
      await fetchPlatforms();
      toast({
        title: 'Success',
        description: 'Note updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setEditingNote(undefined);
    }
  };

  const toggleKeyStatus = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/keys/${id}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to update key status');
      
      await fetchPlatforms();
      toast({
        title: 'Success',
        description: 'Key status updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deletePlatform = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/platforms/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete platform');
      
      await fetchPlatforms();
      toast({
        title: 'Success',
        description: 'Platform deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <CreateKeyDialog onKeyCreated={fetchPlatforms} />
      </div>

      <div className="space-y-2">
        {platforms.map((platform) => (
          <div key={platform.id} className="border rounded-lg">
            <div className="flex items-center justify-between p-2 bg-muted/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platform.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(platform.created_at).toLocaleDateString()}
                  </span>
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
                  onKeyGroupCreated={fetchPlatforms}
                  platformId={platform.id}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlatform(platform.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="divide-y">
                {platform.key_groups.map((group) => (
                  <div key={group.id} className="p-2 pl-4">
                    <div className="flex items-center justify-between">
                      <div>
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
                          onKeyCreated={fetchPlatforms}
                          platformId={platform.id}
                          groupId={group.id}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteKeyGroup(group.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mt-2">
                        {group.keys.map((key) => (
                          <div key={key.id} className="flex items-center justify-between py-1 pl-4">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={`px-1.5 py-0.5 text-xs rounded ${key.revoked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {key.revoked ? 'Revoked' : 'Active'}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {new Date(key.created_at).toLocaleDateString()}
                              </span>

                              <div className="flex-1 min-w-0">
                                {editingNote === key.id ? (
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      updateNote(key.id, noteValue);
                                    }}
                                    className="flex items-center gap-1"
                                  >
                                    <Input
                                      value={noteValue}
                                      onChange={(e) => setNoteValue(e.target.value)}
                                      className="h-6 text-xs"
                                      autoFocus
                                      onBlur={() => {
                                        if (noteValue !== key.note) {
                                          updateNote(key.id, noteValue);
                                        }
                                        setEditingNote(undefined);
                                      }}
                                    />
                                  </form>
                                ) : (
                                  <div
                                    className="text-xs text-muted-foreground truncate cursor-text px-2 py-1 rounded border border-transparent hover:border-input hover:bg-accent/50 focus:border-input focus:bg-accent/50 transition-colors"
                                    onClick={() => {
                                      setEditingNote(key.id);
                                      setNoteValue(key.note || "");
                                    }}
                                  >
                                    <span className="flex items-center gap-1">
                                      {/* <PencilIcon className="h-3 w-3" /> */}
                                      {key.note || "Click to add note"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="w-32 overflow-hidden font-mono">
                                <span className="text-sm text-muted-foreground">
                                  {showValues[key.id] ? (
                                    key.value
                                  ) : (
                                    key.value.replace(/./g, '•')
                                  )}
                                </span>
                              </div>


                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleValueVisibility(key.id)}
                              >
                                {showValues[key.id] ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(key.value)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleKeyStatus(key.id)}
                                className={key.revoked ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
                              >
                                <span className="sr-only">{key.revoked ? 'Activate' : 'Revoke'} key</span>
                                {key.revoked ? '🔓' : '🔒'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteKey(key.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
                ))}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
