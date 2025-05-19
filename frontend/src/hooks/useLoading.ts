import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useLoading() {
  const [isMarkerLoading] = useStore(useShallow((s) => [s.isMarkerLoading]));

  return { isMarkerLoading };
}
