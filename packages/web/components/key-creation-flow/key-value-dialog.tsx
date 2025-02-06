'use client';

import { useAtom } from 'jotai';
import { useToast } from '@/hooks/use-toast';
import { useCreateKey } from '@/hooks/usePlatforms';
import { BaseDialog } from '../ui/base-dialog';
import { KeyValueForm } from '../forms/key-value-form';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';

export function KeyValueDialog() {
  const [flowState, setFlowState] = useAtom(keyCreationFlowAtom);
  const { mutate: createKey, isPending } = useCreateKey();
  const { toast } = useToast();

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

    if (!flowState.groupId) {
      toast({
        title: "Error",
        description: "Group ID is required",
        variant: "destructive",
      });
      return;
    }

    createKey({
      groupId: flowState.groupId,
      data,
    }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Key created successfully",
        });
        handleClose();
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
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
