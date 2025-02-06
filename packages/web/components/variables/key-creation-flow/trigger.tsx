'use client';

import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';
import type { KeyCreationStep } from '@/atoms/key-creation-flow';

interface KeyCreationTriggerProps {
  /** 从哪一步开始 */
  startStep?: KeyCreationStep;
  /** 如果从 key-name 开始，需要提供 platformId */
  platformId?: string;
  /** 自定义触发器按钮 */
  children?: React.ReactNode;
}

export function KeyCreationTrigger({ startStep = 'platform', platformId, children }: KeyCreationTriggerProps) {
  const [, setFlowState] = useAtom(keyCreationFlowAtom);

  const handleClick = () => {
    if (startStep === 'key-name' && !platformId) {
      console.error('platformId is required when startStep is key-name');
      return;
    }

    setFlowState({
      isOpen: true,
      step: startStep,
      platformId,
    });
  };

  if (children) {
    return (
      <div onClick={handleClick}>
        {children}
      </div>
    );
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      New Key
    </Button>
  );
}
