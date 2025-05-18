import { Box, Paper, Typography } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';
import { parse } from 'date-fns';

export function Dashboard() {
  return (
    <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <VisitChart />
    </Box>
  );
}

type VisitDataOfDays = {
  date: string;
  count: number;
  unique_visitors: number;
  signed_users: number;
  pwa_visitors: number;
  web_visitors: number;
};

type VisitDataOfHours = {
  kst_hour: number;
  visit_count: number;
  unique_visit_count: number;
  signed_users: number;
};

function VisitChart() {
  // [ ]: fetch 훅으로 분리
  // [ ]: 유효성 검사
  const { data: visitOfDays } = useQuery({
    queryKey: ['visit'],
    queryFn: async () => {
      const { data } = await api.get<VisitDataOfDays[]>('/visit');

      return data;
    },
  });

  const { data: visitOfHours } = useQuery({
    queryKey: ['visit', 'hourly'],
    queryFn: async () => {
      const { data } = await api.get<VisitDataOfHours[]>('/visit/hourly');

      return data;
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
      }}
    >
      <Paper sx={{ width: '100%', height: 400, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          일별 방문 통계
        </Typography>

        <ResponsiveContainer width="100%" height="90%">
          <ComposedChart data={visitOfDays}>
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

      <Paper sx={{ width: '100%', height: 400, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          시간별 방문 통계
        </Typography>

        <ResponsiveContainer width="100%" height="90%">
          <ComposedChart data={visitOfHours}>
            <XAxis
              dataKey="kst_hour"
              tickFormatter={(value) => {
                if (typeof value === 'string') {
                  const parsedDate = parse(value, 'yyyy-MM-dd HH:mm', new Date());

                  return `${parsedDate.getHours()}시`;
                }

                return value;
              }}
            />
            <YAxis yAxisId="left" allowDecimals={false} />
            <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
            <Tooltip />
            <Legend />

            <Bar yAxisId="left" dataKey="visit_count" fill="#8884d8" name="전체 방문 수" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="unique_visit_count"
              stroke="#82ca9d"
              strokeWidth={2}
              name="고유 방문자 수"
            />
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

      <Paper sx={{ width: '100%', height: 400, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          환경별 방문 통계
        </Typography>

        <ResponsiveContainer width="100%" height="90%">
          <ComposedChart data={visitOfDays}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" allowDecimals={false} />
            <Tooltip />
            <Legend />

            <Line yAxisId="left" type="monotone" dataKey="web_visitors" stroke="#82ca9d" strokeWidth={2} name="웹" />

            <Line yAxisId="left" type="monotone" dataKey="pwa_visitor" stroke="#ffc658" strokeWidth={2} name="PWA" />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
