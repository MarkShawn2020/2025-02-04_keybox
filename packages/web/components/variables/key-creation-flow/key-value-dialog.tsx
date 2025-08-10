'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useToast } from '@/hooks/use-toast';
import { BaseDialog } from '@/components/ui/base-dialog';
import { KeyValueForm } from '../forms/key-value-form';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';
import { addKeyAtom, platformsAtom } from '@/atoms/localStorage';
import { useState } from 'react';

export function KeyValueDialog() {
  const [flowState, setFlowState] = useAtom(keyCreationFlowAtom);
  const { toast } = useToast();
  const addKey = useSetAtom(addKeyAtom);
  const [platforms] = useAtom(platformsAtom);
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
    const formData = new FormData(e.currentTarget);
    const data = {
      value: formData.get('value') as string,
      note: formData.get('note') as string || undefined,
    };

    if (!data.value.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive",
      });
      return;
    }

    if (!flowState.groupId || !flowState.platformId) {
      toast({
        title: "Error",
        description: "Platform and Group ID are required",
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);
    try {
      addKey({
        platformId: flowState.platformId,
        groupId: flowState.groupId,
        key: {
          value: data.value,
          note: data.note,
          revoked: false
        }
      });
      
      toast({
        title: "Success",
        description: "Key created successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create key",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <BaseDialog
      open={flowState.isOpen && flowState.step === 'key-value'}
      onOpenChange={(open) => !open && handleClose()}
      title="Create New Key Value"
    >
      <KeyValueForm onSubmit={handleSubmit} isLoading={isPending} />
    </BaseDialog>
  );
}
