import { Box, Paper, Typography } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
  unique_visitors: number;
  signed_users: number;
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
        <ComposedChart data={data}>
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" allowDecimals={false} />
          <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
          <Tooltip />
          <Legend />

          {/* 막대: 전체 방문 수 */}
          <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="전체 방문 수" />

          {/* 선: 고유 방문자 */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="unique_visitors"
            stroke="#82ca9d"
            strokeWidth={2}
            name="고유 방문자 수"
          />

          {/* 선: 회원 방문자 */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="signed_users"
            stroke="#ffc658"
            strokeWidth={2}
            name="회원 방문자 수"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
}
