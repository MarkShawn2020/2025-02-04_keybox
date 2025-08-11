'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
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
  /** 外部控制开关状态 */
  open?: boolean;
  /** 外部控制开关状态变化 */
  onOpenChange?: (open: boolean) => void;
}

export function KeyCreationTrigger({ 
  startStep = 'platform', 
  platformId, 
  children,
  open,
  onOpenChange 
}: KeyCreationTriggerProps) {
  const [flowState, setFlowState] = useAtom(keyCreationFlowAtom);

  // Handle external control
  useEffect(() => {
    if (open !== undefined) {
      if (open && startStep === 'key-name' && !platformId) {
        console.error('platformId is required when startStep is key-name');
        return;
      }
      
      setFlowState({
        isOpen: open,
        step: startStep,
        platformId,
      });
    }
  }, [open, startStep, platformId, setFlowState]);

  // Notify parent when flow closes
  useEffect(() => {
    if (onOpenChange && !flowState.isOpen && open) {
      onOpenChange(false);
    }
  }, [flowState.isOpen, open, onOpenChange]);

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

  // If externally controlled, don't render trigger button
  if (open !== undefined) {
    return null;
  }

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
