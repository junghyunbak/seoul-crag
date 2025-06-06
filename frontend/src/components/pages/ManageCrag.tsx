import { Box } from '@mui/material';
import { useParams } from 'react-router';

export default function ManageCrag() {
  const { id } = useParams<{ id: string }>();

  return <Box>암장 하나 관리{id}</Box>;
}
