import { api } from '@/api/axios';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const contributionScheme = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
});

const contributionsScheme = z.array(contributionScheme);

declare global {
  type Contribution = z.infer<typeof contributionScheme>;
}

export function Contributions() {
  const { data } = useQuery({
    queryKey: ['contributions'],
    queryFn: async () => {
      const { data } = await api.get('/contribution');

      const contributions = contributionsScheme.parse(data);

      return contributions;
    },
  });

  return <Box sx={{ p: 2 }}>{JSON.stringify(data, null, 2)}</Box>;
}
