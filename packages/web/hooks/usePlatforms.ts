import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { Platform } from '@keybox/shared'

export function usePlatforms() {
  return useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: () => axios.get('/api/platforms').then(res => res.data)
  })
}

export function useUpdateKeyGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      groupId, 
      data 
    }: { 
      groupId: string; 
      data: { 
        name: string; 
        description?: string; 
        tags?: string[] 
      } 
    }) => axios.patch(`/api/key-groups/${groupId}`, data),
    onSuccess: () => {
      // 更新成功后使缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useDeleteKeyGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (groupId: string) => 
      axios.delete(`/api/key-groups/${groupId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useUpdateKeyNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      keyId, 
      note 
    }: { 
      keyId: string; 
      note: string 
    }) => axios.patch(`/api/keys/${keyId}/note`, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useToggleKeyStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (keyId: string) => 
      axios.post(`/api/keys/${keyId}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useDeleteKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (keyId: string) => 
      axios.delete(`/api/keys/${keyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useCreateKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { 
      platformId: string;
      groupId: string;
      value: string;
      note?: string;
    }) => axios.post('/api/keys', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}

export function useDeletePlatform() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (platformId: string) => 
      axios.delete(`/api/platforms/${platformId}`),
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
    }) => axios.post('/api/key-groups', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    }
  })
}
