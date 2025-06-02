import { useExp } from '@/hooks/useExp';
import { useFetchCrags } from '@/hooks/useFetchCrag';
import { useFilter } from '@/hooks/useFilter';
import { useSearch } from '@/hooks/useSearch';
import { useStore } from '@/store';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

export function useSetupCrag() {
  const { exp } = useExp();
  const { searchKeyword } = useSearch();
  const { getCragStats } = useFilter();

  const { crags } = useFetchCrags({});

  const [setCrags] = useStore(useShallow((s) => [s.setCrags]));

  useEffect(() => {
    if (!crags) {
      return;
    }

    const filteredCrags = crags.filter((crag) => {
      const { isFiltered } = getCragStats(crag, exp.date, searchKeyword);

      return isFiltered;
    });

    setCrags(filteredCrags);
  }, [crags, setCrags, exp, searchKeyword, getCragStats]);
}
