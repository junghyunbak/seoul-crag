import { useMemo } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useTag() {
  const [tags] = useStore(useShallow((s) => [s.tags]));

  const [selectTagId] = useStore(useShallow((s) => [s.selectTagId]));

  const tagTypeToTags = useMemo(() => {
    const _tagTypeToTags = new Map<TagType, Tag[]>();

    tags?.forEach((tag) => {
      const tags = _tagTypeToTags.get(tag.type) || [];

      tags.push(tag);

      _tagTypeToTags.set(tag.type, tags);
    });

    return _tagTypeToTags;
  }, [tags]);

  const tagTypes = useMemo(() => {
    return Array.from(tagTypeToTags.keys());
  }, [tagTypeToTags]);

  return { selectTagId, tagTypes, tagTypeToTags };
}
