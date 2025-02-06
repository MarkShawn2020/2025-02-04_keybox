'use client';

import { useAtom } from 'jotai';
import { useToast } from '@/hooks/use-toast';
import { useCreatePlatform } from '@/hooks/usePlatforms';
import { BaseDialog } from '@/components/ui/base-dialog';
import { PlatformForm } from '../forms/platform-form';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';
import { actions } from '@/utils/actions';

export function PlatformDialog() {
  const [flowState, setFlowState] = useAtom(keyCreationFlowAtom);
  const { toast } = useToast();
  const { mutate: createPlatform, isPending } = useCreatePlatform();

  const handleClose = () => {
    setFlowState(prev => ({
      ...prev,
      isOpen: false,
      platformId: undefined,
      groupId: undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
          setFlowState(prev => ({
            ...prev,
            platformId: newPlatform.id,
            step: 'key-name'
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
