'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useToast } from '@/hooks/use-toast';
import { BaseDialog } from '@/components/ui/base-dialog';
import { PlatformForm } from '../forms/platform-form';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';
import { addPlatformAtom } from '@/atoms/localStorage';
import { useState } from 'react';

export function PlatformDialog() {
  const [flowState, setFlowState] = useAtom(keyCreationFlowAtom);
  const { toast } = useToast();
  const addPlatform = useSetAtom(addPlatformAtom);
  const [isPending, setIsPending] = useState(false);

  const handleClose = () => {
    setFlowState(prev => ({
      ...prev,
      isOpen: false,
      platformId: undefined,
      groupId: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
      };

      const newPlatform = addPlatform(data);
      
      setFlowState(prev => ({
        ...prev,
        platformId: newPlatform.id,
        step: 'key-name'
      }));
      
      toast({
        title: 'Success',
        description: 'Platform created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create platform',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <BaseDialog
      open={flowState.isOpen && flowState.step === 'platform'}
      onOpenChange={(open) => !open && handleClose()}
      title="Create New Platform"
    >
      <PlatformForm onSubmit={handleSubmit} isLoading={isPending} />
    </BaseDialog>
  );
}
