import { Box, Switch, FormControlLabel } from '@mui/material';

import { useMap, useModifyMap } from '@/hooks';

export function MapOptions() {
  const { enabledEdgeIndicator, enabledGpsIndicator } = useMap();

  const { updateEnabledEdgeIndicator, updateEnabledGpsIndicator } = useModifyMap();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={enabledEdgeIndicator}
            onChange={() => {
              updateEnabledEdgeIndicator(!enabledEdgeIndicator);
            }}
          />
        }
        label="화면 밖 암장 표시"
      />
      <FormControlLabel
        control={
          <Switch
            checked={enabledGpsIndicator}
            onChange={() => {
              updateEnabledGpsIndicator(!enabledGpsIndicator);
            }}
          />
        }
        label="화면 밖 내 위치 표시"
      />
    </Box>
  );
}
