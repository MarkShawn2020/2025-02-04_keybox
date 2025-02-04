'use client';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Key, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
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

      <div className="grid gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">{platform.name}</Label>
                  <span className="text-xs text-muted-foreground">
                    Created {new Date(platform.created_at).toLocaleDateString()}
                  </span>
                </div>
                {platform.description && (
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                )}
                {platform.tags && platform.tags.length > 0 && (
                  <div className="flex gap-2">
                    {platform.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
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
            
            <div className="pl-4 space-y-4">
                {platform.key_groups.map((group) => (
                  <Card key={group.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <Label className="font-medium">{group.name}</Label>
                          <span className="text-xs text-muted-foreground">
                            Created {new Date(group.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
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
                    
                    <div className="space-y-3">
                        {group.keys.map((key) => (
                          <div key={key.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${key.revoked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                  {key.revoked ? 'Revoked' : 'Active'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Added {new Date(key.created_at).toLocaleDateString()}
                                </span>
                                {key.note && (
                                  <span className="text-xs text-muted-foreground">Note: {key.note}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleValueVisibility(key.id)}
                                >
                                  {showValues[key.id] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(key.value)}
                                >
                                  <Copy className="h-4 w-4" />
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
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Input
                              type="text"
                              value={showValues[key.id] ? key.value : `${key.value.slice(0, 2)}...${key.value.slice(-2)}`}
                              readOnly
                              className="font-mono"
                            />
                          </div>
                        ))}
                      </div>
                  </Card>
                ))}
              </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
