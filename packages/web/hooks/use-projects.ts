'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import type { ProjectWithKeys } from '@keybox/shared';
import { actions } from '@/utils/actions';

export function useProjects() {
  const { toast } = useToast();
  
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const data = await actions.getProjectKeys('');
        return data;
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    }
  });

  return {
    ...query,
    loading: query.isLoading,
    projects: query.data || [],
  };
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; keys?: string[] }) => {
      try {
        const result = await actions.createProject({
          user_id: '',  // Will be set by server
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          id: '',  // Will be set by server
          name: data.name,
          description: data.description || '',
          keys: data.keys || [],
        });
        return result;
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      try {
        return await actions.deleteProject(projectId);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    }
  });
}
