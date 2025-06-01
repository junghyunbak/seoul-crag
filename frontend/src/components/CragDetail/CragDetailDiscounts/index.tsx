import { useContext } from 'react';

import { Box, Typography } from '@mui/material';

import { CragDetailContext } from '@/components/CragDetail/index.context';
import { DAYS_OF_KOR } from '@/constants/time';
import { DateService } from '@/utils/time';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function CragDetailDiscounts() {
  const { crag } = useContext(CragDetailContext);

  if (!crag || crag.gymDiscounts.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        할인 정보
      </Typography>

      <Typography>1일 이용: {crag.price.toLocaleString()}원</Typography>

      {crag.gymDiscounts.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {crag.gymDiscounts
            .sort((a, b) => (a.type < b.type ? -1 : 1))
            .map((gymDiscount) => {
              const { id, price } = gymDiscount;

              const tmp = (() => {
                switch (gymDiscount.type) {
                  case 'group': {
                    const { min_group_size } = gymDiscount;

                    return `${min_group_size}인 이상 단체 입장시`;
                  }
                  case 'time': {
                    const { weekday, time_start, time_end } = gymDiscount;

                    const start = DateService.timeStrToDate(time_start, new Date());
                    const end = DateService.timeStrToDate(time_end, new Date());

                    return `${DAYS_OF_KOR[weekday]} ${format(start, 'hh:mm')} ~ ${format(end, 'hh:mm')}`;
                  }
                  case 'event': {
                    const { date, time_start, time_end } = gymDiscount;

                    const start = DateService.timeStrToDate(time_start, new Date());
                    const end = DateService.timeStrToDate(time_end, new Date());

                    return `${format(new Date(date), 'M월 dd일 (E)', { locale: ko })} ${format(
                      start,
                      'hh:mm'
                    )} ~ ${format(end, 'hh:mm')}`;
                  }
                }
              })();

              return (
                <Box
                  key={id}
                  sx={(theme) => ({
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: `1px dashed ${theme.palette.divider}`,
                    '&:last-of-type': {
                      borderBottom: 0,
                    },
                  })}
                >
                  <Typography
                    variant="body2"
                    sx={(theme) => ({ color: theme.palette.text.secondary, fontFamily: 'Roboto Mono, monospace' })}
                  >
                    {tmp}
                  </Typography>

                  <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                    {price.toLocaleString()}원 ← <del>{crag.price.toLocaleString()}원</del>
                  </Typography>
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
}
