import { Box } from '@mui/material';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFetchImages } from '@/hooks';

export function CragInteriorPreview() {
  const [selectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);
  const [, setInteriorStory] = useQueryParam(QUERY_STRING.STORY_INTERIOR, StringParam);

  const { images } = useFetchImages(selectCragId, 'interior');

  if (!images || images.length === 0) {
    return;
  }

  return (
    <Box
      component="img"
      src={images[0].url}
      sx={(theme) => ({
        width: '150px',
        aspectRatio: '2/1',
        objectFit: 'cover',
        border: `1px solid ${theme.palette.common.white}`,
        boxShadow: 2,
        cursor: 'pointer',
      })}
      onClick={() => {
        setInteriorStory(selectCragId);
      }}
    />
  );
}
