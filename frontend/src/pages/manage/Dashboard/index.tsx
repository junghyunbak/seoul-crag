import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

export function Dashboard() {
  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <VisitChart />
    </Box>
  );
}

type VisitData = {
  date: string;
  count: number;
};

function VisitChart() {
  // [ ]: fetch 훅으로 분리
  // [ ]: 유효성 검사
  const { data } = useQuery({
    queryKey: ['visit'],
    queryFn: async () => {
      const { data } = await api.get<VisitData[]>('/visit');

      return data;
    },
  });

  return (
    <Paper sx={{ width: '100%', height: 400, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        일별 방문 통계
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="date" interval="preserveStartEnd" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
