'use client';

import { atom } from 'jotai';

export type Step = 'platform' | 'group' | 'key';

export interface CreateVariableDialogState {
  isOpen: boolean;
  name?: string;
  step: Step;
  platformId?: string;
  groupId?: string;
}

export const createVariableDialogAtom = atom<CreateVariableDialogState>({
  isOpen: false,
  name: undefined,
  step: 'platform',
  platformId: undefined,
  groupId: undefined,
});
