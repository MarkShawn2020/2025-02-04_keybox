import { atom } from 'jotai';

export type CreateKeyFlowState = {
  isOpen: boolean;
  step: 'key-name' | 'key-value';
  platformId?: string;
  groupId?: string;
};

export const createKeyFlowAtom = atom<CreateKeyFlowState>({
  isOpen: false,
  step: 'key-name',
  platformId: undefined,
  groupId: undefined,
});
