import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useCafe() {
  const [cafes] = useStore(useShallow((s) => [s.cafes]));

  return {
    cafes,
  };
}
