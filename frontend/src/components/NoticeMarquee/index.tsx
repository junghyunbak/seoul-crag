import { useMemo } from 'react';

import { Box, Typography } from '@mui/material';

import Marquee from 'react-fast-marquee';

export function NoticeMarquee() {
  const NOTICE_TEXTS = useMemo(
    () => [
      `📢 모든 이미지에는 출처를 표기하였습니다. 그러나 문제가 될 경우 즉시 삭제하겠습니다. 연락처는 jeong5728@gmail.com 입니다.`,
      '',
      `📅 암장의 세팅, 휴무 일정은 인스타그램을 참고하여 수기로 정리한 것입니다. 실제 암장 관리자가 계정을 소유하기 전까지는 재차 확인하는 것을 권장드립니다.`,
      '',
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
            <Typography key={index} fontSize="0.875rem" color="white">
              {noticeText}
            </Typography>
          );
        })}
      </Marquee>
    </Box>
  );
}
