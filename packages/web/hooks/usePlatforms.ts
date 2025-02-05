import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Platform } from '@keybox/shared'
import { api } from '@/utils/axios'

export function usePlatforms() {
  return useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: () => api.get('/keys').then(res => res.data)
  })
}

export function useUpdateKeyGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ groupId, data }: { 
      groupId: string; 
      data: { 
        name: string; 
        description?: string; 
        tags?: string[] 
      } 
    }) => {
      const response = await api.patch(`/keys/groups/${groupId}`, data);
      return response.data;
    },
    onSuccess: () => {
      // 更新成功后使缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useDeleteKeyGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (groupId: string) => api.delete(`/keys/groups/${groupId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useUpdateKeyNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ keyId, note }: { 
      keyId: string; 
      note: string 
    }) => api.patch(`/keys/${keyId}/note`, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useToggleKeyStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (keyId: string) => api.post(`/keys/${keyId}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useDeleteKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (keyId: string) => api.delete(`/keys/${keyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useDeletePlatform() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (platformId: string) => api.delete(`/platforms/${platformId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useCreateKeyGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { 
      platformId: string;
      name: string;
      description?: string;
    }) => api.post('/keys/groups', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useCreateKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ groupId, data }: { 
      groupId: string;
      data: {
        value: string;
        note?: string;
      };
    }) => api.post(`/keys/groups/${groupId}/keys`, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useCreatePlatform() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { 
      name: string;
      description?: string;
      tags?: string[];
    }) => api.post('/keys/platforms', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}
