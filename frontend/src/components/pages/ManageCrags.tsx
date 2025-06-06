import { Box } from '@mui/material';
import { Outlet } from 'react-router';

export default function ManageCrags() {
  return (
    <Box>
      여러 암장 관리 페이지
      <Outlet />
    </Box>
  );
}
