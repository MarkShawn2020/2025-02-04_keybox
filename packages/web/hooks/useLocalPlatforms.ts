'use client';

import { useAtom } from 'jotai';
import { platformsAtom } from '@/atoms/localStorage';

export function useLocalPlatforms() {
  const [platforms] = useAtom(platformsAtom);
  
  return {
    data: platforms,
    isLoading: false,
    error: null
  };
}