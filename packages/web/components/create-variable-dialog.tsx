'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { useToast } from '@/hooks/use-toast';
import { useCreatePlatform, useCreateKeyGroup, useCreateKey } from '@/hooks/usePlatforms';
import { BaseDialog } from './ui/base-dialog';
import { PlatformForm } from './forms/platform-form';
import { KeyNameForm } from './forms/key-name-form';
import { KeyValueForm } from './forms/key-value-form';
import { createVariableDialogAtom, CreateVariableDialogState } from '@/atoms/dialog';
import { actions } from '@/utils/actions';

export function CreateVariableDialog() {
  const [dialogState, setDialogState] = useAtom(createVariableDialogAtom);

  const { toast } = useToast();

  const { mutate: createPlatform, isPending: isCreatingPlatform } = useCreatePlatform();
  const { mutate: createKeyGroup, isPending: isCreatingGroup } = useCreateKeyGroup();
  const { mutate: createKey, isPending: isCreatingKey } = useCreateKey();

  const handlePlatformSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
    };

    createPlatform({ data }, {
      onSuccess: async () => {
        // After creating platform, fetch the latest platforms to get the new ID
        const platforms = await actions.listKeys();
        const newPlatform = platforms.find(p => p.name === data.name);
        if (newPlatform?.id) {
          setDialogState((prev: CreateVariableDialogState) => ({
            ...prev,
            platformId: newPlatform.id,
            step: 'group'
          }));
        }
        toast({
          title: 'Success',
          description: 'Platform created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleGroupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    };

    createKeyGroup({ platformId: dialogState.platformId!, data }, {
      onSuccess: async () => {
        // After creating group, fetch the latest data to get the new ID
        const platforms = await actions.listKeys();
        const platform = platforms.find(p => p.id === dialogState.platformId);
        const newGroup = platform?.key_groups?.find(g => g.name === data.name);
        if (newGroup?.id) {
          setDialogState((prev: CreateVariableDialogState) => ({
            ...prev,
            groupId: newGroup.id,
            step: 'key'
          }));
        }
        toast({
          title: 'Success',
          description: 'Key group created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      value: formData.get('value') as string,
      note: formData.get('note') as string || undefined,
    };

    createKey({
      groupId: dialogState.groupId!,
      data,
    }, {
      onSuccess: () => {
        handleClose();
        toast({
          title: 'Success',
          description: 'Key created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleClose = () => {
    setDialogState(prev => ({
      ...prev,
      isOpen: false,
      step: 'platform',
      platformId: undefined,
      groupId: undefined
    }));
  };

  const getStepTitle = () => {
    switch (dialogState.step) {
      case 'platform':
        return 'Step 1/3. Add New Key Platform';
      case 'group':
        return 'Step 2/3. Add New Key Name';
      case 'key':
        return 'Step 3/3. Add New Key Value';
      default:
        return 'Add New Variable';
    }
  };

  return (
    <BaseDialog
      open={dialogState.isOpen}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        } else {
          setDialogState(prev => ({
            ...prev,
            isOpen: true,
            step: 'platform',
            platformId: undefined,
            groupId: undefined
          }));
        }
      }}
      title={getStepTitle()}
      triggerText={dialogState.name || "Add New"}
    >
      {dialogState.step === 'platform' && (
        <PlatformForm
          onSubmit={handlePlatformSubmit}
          isLoading={isCreatingPlatform}
        />
      )}

      {dialogState.step === 'group' && (
        <KeyNameForm
          onSubmit={handleGroupSubmit}
          isLoading={isCreatingGroup}
        />
      )}

      {dialogState.step === 'key' && (
        <KeyValueForm
          onSubmit={handleKeySubmit}
          isLoading={isCreatingKey}
        />
      )}
    </BaseDialog>
  );
}
         