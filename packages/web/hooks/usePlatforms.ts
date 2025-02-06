'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Platform } from '@keybox/shared';
import { useToast } from './use-toast';
import { actions } from '@/utils/actions';

export function usePlatforms() {
  const { toast } = useToast();
  return useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: async () => {
      try {
        return await actions.listKeys();
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
}

export function useCreatePlatform() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ data }: {
      data: {
        name: string;
        description?: string;
        tags?: string[];
      };
    }) => {
      try {
        return await actions.createPlatform(data);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Platform created successfully',
      });
    }
  });
}

export function useCreateKeyName() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ platformId, data }: {
      platformId: string;
      data: {
        name: string;
        description?: string;
        tags?: string[];
      };
    }): Promise<{ success: boolean; groupId?: string }> => {
      try {
        const result = await actions.createKeyName(platformId, data);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Key Name created successfully',
      });
    }
  });
}

export function useCreateKey() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ groupId, data }: {
      groupId: string;
      data: {
        value: string;
        note?: string;
        tags?: string[];
      };
    }) => {
      try {
        return await actions.createKey(groupId, data);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Key created successfully',
      });
    }
  });
}

export function useDeleteKey() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (keyId: string) => {
      try {
        return await actions.deleteKey(keyId);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Key deleted successfully',
      });
    }
  });
}

export function useUpdateKeyName() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ groupId, data }: {
      groupId: string;
      data: {
        name: string;
        description?: string;
        tags?: string[];
      };
    }) => {
      try {
        return await actions.updateKeyName(groupId, data);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Key Name updated successfully',
      });
    }
  });
}

export function useUpdateKeyNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ keyId, note }: {
      keyId: string;
      note: string;
    }) => {
      try {
        return await actions.updateKeyNote(keyId, note);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Key note updated successfully',
      });
    }
  });
}

export function useToggleKeyStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (keyId: string) => {
      try {
        return await actions.toggleKeyStatus(keyId);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Key status toggled successfully',
      });
    }
  });
}

export function useDeletePlatform() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (platformId: string) => {
      try {
        return await actions.deletePlatform(platformId);
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
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast({
        title: 'Success',
        description: 'Platform deleted successfully',
      });
    }
  });
}
