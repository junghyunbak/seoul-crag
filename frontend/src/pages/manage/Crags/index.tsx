import { StringParam, useQueryParam } from 'use-query-params';

import { useFetchCrags } from '@/hooks';

import { Box } from '@mui/material';

import { CragForm } from '@/pages/manage/Crags/CragForm';

import { QUERY_STRING } from '@/constants';

import { cragsContext } from '@/pages/manage/Crags/index.context';

import { CragList } from './CragList';

export default function Crags() {
  const { crags } = useFetchCrags({ feeds: true });

  const [selectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const crag = crags?.find((crag) => crag.id === selectCragId);

  if (!crags) {
    return null;
  }

  return (
    <cragsContext.Provider
      value={{
        crags,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {!crag ? <CragList /> : <CragForm initialCrag={crag} />}
      </Box>
    </cragsContext.Provider>
  );
}
