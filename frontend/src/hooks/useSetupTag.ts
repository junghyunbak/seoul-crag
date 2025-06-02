import { useFetchTags } from '@/hooks/useFetchTag';
import { useModifyTag } from '@/hooks/useModifyTag';
import { useEffect } from 'react';

export function useSetupTag() {
  const { tags } = useFetchTags();

  const { updateTags } = useModifyTag();

  useEffect(() => {
    if (!tags) {
      return;
    }

    updateTags(tags);
  }, [tags, updateTags]);
}
