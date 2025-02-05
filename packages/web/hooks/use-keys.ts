import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from './use-toast';
import type { Platform } from '@keybox/shared';

export function useKeys() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlatforms = useCallback(async () => {
    try {
      console.log('fetching platforms...');
      
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

  const updateGroup = async (groupId: string, data: { name: string; description?: string; tags?: string[] }) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys/groups/${groupId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to update group');
      
      await fetchPlatforms();
      toast({
        title: 'Success',
        description: 'Group updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  return {
    platforms,
    loading,
    fetchPlatforms,
    deleteKey,
    deleteKeyGroup,
    updateNote,
    toggleKeyStatus,
    deletePlatform,
    updateGroup,
  };
}
