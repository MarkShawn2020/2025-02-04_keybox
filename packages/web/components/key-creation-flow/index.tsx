'use client';

import { useAtom } from 'jotai';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';
import { PlatformDialog } from './platform-dialog';
import { KeyNameDialog } from './key-name-dialog';
import { KeyValueDialog } from './key-value-dialog';

export function KeyCreationFlow() {
  const [flowState] = useAtom(keyCreationFlowAtom);

  if (!flowState.isOpen) return null;

  switch (flowState.step) {
    case 'platform':
      return <PlatformDialog />;
    case 'key-name':
      return <KeyNameDialog />;
    case 'key-value':
      return <KeyValueDialog />;
    default:
      return null;
  }
}
