import { useMemo } from 'react';

import { Box, Typography } from '@mui/material';

import Marquee from 'react-fast-marquee';

export function NoticeMarquee() {
  const NOTICE_TEXTS = useMemo(
    () => [
      ``,
      `암장의 세팅, 휴무, 할인 일정은 인스타그램을 참고하여 수기로 정리한 것입니다. 재차 확인하는 것을 권장합니다.`,
      ``,
    ],
    []
  );

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'black',
        py: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <Marquee gradient={false} pauseOnHover direction="left">
        {NOTICE_TEXTS.map((noticeText, index) => {
          if (!noticeText) {
            return <Box sx={{ width: '40px' }} key={index} />;
          }

          return (
            <Typography
              key={index}
              sx={{
                color: 'white',
                fontSize: '0.875rem',
              }}
            >
              {noticeText}
            </Typography>
          );
        })}
      </Marquee>
    </Box>
  );
}
