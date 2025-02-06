import { atom } from 'jotai';

export type KeyCreationStep = 'platform' | 'key-name' | 'key-value';

interface KeyCreationFlowState {
  isOpen: boolean;
  step: KeyCreationStep;
  platformId?: string;
  groupId?: string;
}

const initialState: KeyCreationFlowState = {
  isOpen: false,
  step: 'platform',
};

export const keyCreationFlowAtom = atom<KeyCreationFlowState>(initialState);
