'use client';

import { useAtom } from 'jotai';
import { createKeyFlowAtom } from '@/atoms/create-key-flow';
import { BaseDialog } from './ui/base-dialog';
import { KeyGroupDialog } from './key-group-dialog';
import { KeyValueForm } from './forms/key-value-form';
import { useCreateKey } from '@/hooks/usePlatforms';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface CreateKeyFlowDialogProps {
  platformId: string;
}

export function CreateKeyFlowDialog({ platformId }: CreateKeyFlowDialogProps) {
  const [flowState, setFlowState] = useAtom(createKeyFlowAtom);
  const { mutate: createKey } = useCreateKey();
  const { toast } = useToast();

  const handleClose = () => {
    setFlowState(prev => ({
      ...prev,
      isOpen: false,
      step: 'key-name',
      groupId: undefined,
    }));
  };

  const handleKeyNameCreated = (data: { name: string; description?: string; tags?: string[] }) => {
    setFlowState(prev => ({
      ...prev,
      step: 'key-value',
      groupId: data.id, // 这里会从 onSuccess 回调中获取新创建的 groupId
    }));
  };

  const handleKeyValueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      await createKey({
        groupId: flowState.groupId!,
        data
      });

      toast({
        title: "Success",
        description: "Key created successfully",
      });
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create key",
        variant: "destructive",
      });
    }
  };

  const getStepTitle = () => {
    switch (flowState.step) {
      case 'key-name':
        return 'Create New Key Name';
      case 'key-value':
        return 'Create New Key Value';
      default:
        return 'Create New Key';
    }
  };

  return (
    <BaseDialog
      open={flowState.isOpen}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        } else {
          setFlowState(prev => ({
            ...prev,
            isOpen: true,
            platformId,
          }));
        }
      }}
      title={getStepTitle()}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFlowState(prev => ({ ...prev, isOpen: true, platformId }))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      }
    >
      <div className="p-4">
        {flowState.step === 'key-name' && (
          <KeyGroupDialog
            mode="create"
            platformId={platformId}
            onSuccess={handleKeyNameCreated}
            renderContent
          />
        )}

        {flowState.step === 'key-value' && (
          <KeyValueForm
            onSubmit={handleKeyValueSubmit}
          />
        )}
      </div>
    </BaseDialog>
  );
}
