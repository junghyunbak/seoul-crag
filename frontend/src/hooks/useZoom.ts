import { useShallow } from 'zustand/shallow';
import { useStore } from '@/store';

export function useZoom() {
  const [zoomLevel] = useStore(useShallow((s) => [s.zoomLevel]));

  return { zoomLevel };
}
