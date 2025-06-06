import { Box } from '@mui/material';

import { Molecules } from '@/components/molecules';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function ManageTopbar() {
  const [setIsManageSidebarOpen] = useStore(useShallow((s) => [s.setIsManageSidebarOpen]));

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        width: '100%',

        borderBottom: `1px solid ${theme.palette.divider}`,

        p: 2,
      })}
    >
      <Molecules.LogoText
        onClick={() => {
          window.location.href = '/';
        }}
      />

      <Box
        sx={{
          display: {
            lg: 'none',
          },
        }}
      >
        <Molecules.MenuTrigger
          onClick={() => {
            setIsManageSidebarOpen(true);
          }}
        />
      </Box>
    </Box>
  );
}
