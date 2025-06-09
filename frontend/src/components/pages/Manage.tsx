import { Outlet } from 'react-router';

import { Box } from '@mui/material';

import { useFetchMe } from '@/hooks';

import { Organisms } from '@/components/organisms';
import { Molecules } from '@/components/molecules';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export default function Manage() {
  const { user } = useFetchMe();

  const [isManageSidebarOpen, setIsManageSidebarOpen] = useStore(
    useShallow((s) => [s.isManageSidebarOpen, s.setIsManageSidebarOpen])
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Organisms.ManageTopbar />

      <Box
        sx={{
          display: 'flex',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        <Organisms.ManageSidebar
          user={user || null}
          isOpen={isManageSidebarOpen}
          onClose={() => {
            setIsManageSidebarOpen(false);
          }}
        />
        <Outlet />
      </Box>

      <Organisms.ImageStory imageType="interior" />
      <Organisms.CalendarStory />
      <Organisms.OperationStory />
      <Organisms.ShowerStory />
      <Organisms.ProfileBottomSheet />
      <Organisms.CragDetail />

      <Molecules.ConfirmToast />
    </Box>
  );
}
