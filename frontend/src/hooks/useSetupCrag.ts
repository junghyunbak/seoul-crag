import { useFetchCrags } from '@/hooks/useFetchCrag';
import { useModifyCrag } from '@/hooks/useModifyCrag';
import { useEffect } from 'react';

export function useSetupCrag() {
  const { crags } = useFetchCrags();

  const { updateCragMap } = useModifyCrag();

  useEffect(() => {
    if (!crags) {
      return;
    }

    updateCragMap(crags);
  }, [crags, updateCragMap]);
}
