import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useCrewCount() {
  const [crewCount] = useStore(useShallow((s) => [s.crewCount]));

  return { crewCount };
}
