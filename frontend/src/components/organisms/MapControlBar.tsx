import { Molecules } from '@/components/molecules';
import { useLoading, useModifySearch } from '@/hooks';
import { Paper, Box } from '@mui/material';

export function MapControlBar() {
  const { isMarkerLoading } = useLoading();

  const { updateIsSearchOpen } = useModifySearch();

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{ p: 1.5, pr: 0, display: 'flex', gap: 1, flex: 1, overflow: 'hidden' }}
          onClick={() => updateIsSearchOpen(true)}
        >
          <Molecules.SearchAndLoading isLoading={isMarkerLoading} />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Molecules.FakeSearhInput />
          </Box>
        </Box>

        <Box sx={{ flexGrow: 0, px: 0.5 }}>
          <Molecules.NoticeModalTrigger />
          <Molecules.MenuTrigger />
        </Box>
      </Box>

      <Box sx={{ p: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Molecules.FilterTrigger />
        <Molecules.ExpeditionDate />
      </Box>
    </Paper>
  );
}
