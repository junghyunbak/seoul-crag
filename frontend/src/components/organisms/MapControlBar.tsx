import { useCrewCount, useLoading, useModifyCrewCount, useModifySearch } from '@/hooks';

import { Paper, Box } from '@mui/material';

import { Molecules } from '@/components/molecules';

import { useQueryParam, BooleanParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

export function MapControlBar() {
  const { isMarkerLoading } = useLoading();
  const { crewCount } = useCrewCount();

  const { updateIsSearchOpen } = useModifySearch();
  const { updateCrewCount } = useModifyCrewCount();

  const [, setIsMenuOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  return (
    <Box
      sx={(theme) => ({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.mapControlBar,
        display: 'flex',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
      })}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'sm',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        <Box sx={{ pointerEvents: 'auto', width: '100%' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{ p: 1.5, pr: 0, display: 'flex', gap: 1, flex: 1, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => updateIsSearchOpen(true)}
              >
                <Molecules.SearchAndLoading isLoading={isMarkerLoading} />
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Molecules.FakeSearhInput />
                </Box>
              </Box>

              <Box sx={{ flexGrow: 0, px: 0.5 }}>
                <Molecules.NoticeModalTrigger />
                <Molecules.MenuTrigger
                  onClick={() => {
                    setIsMenuOpen((prev) => !prev);
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ p: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Molecules.FilterTrigger />
              <Molecules.ExpeditionDate />
            </Box>
          </Paper>
        </Box>

        <Box
          sx={{
            pointerEvents: 'auto',
          }}
        >
          <Molecules.CrewCount
            defaultCount={crewCount}
            onChange={(count) => {
              updateCrewCount(count);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
