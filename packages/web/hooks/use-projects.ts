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
      // Projects feature temporarily disabled while migrating to localStorage
      return [];
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
      // Projects feature temporarily disabled while migrating to localStorage
      toast({
        title: 'Info',
        description: 'Projects feature is temporarily unavailable',
      });
      return { success: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      // Projects feature temporarily disabled while migrating to localStorage
      toast({
        title: 'Info',
        description: 'Projects feature is temporarily unavailable',
      });
      return { success: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}
