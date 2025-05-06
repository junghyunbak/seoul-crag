import { useMemo } from 'react';

import { Box, Typography } from '@mui/material';

import Marquee from 'react-fast-marquee';

export function NoticeMarquee() {
  const NOTICE_TEXTS = useMemo(
    () => [
      `📢 이미지에 출처를 표기했지만 문제가 될 경우 즉시 삭제하겠습니다. 이메일(jeong5728@gmail.com)로 문의주세요.`,
      'ㅤㅤㅤㅤㅤ',
      `📅 세팅 날짜, 휴무일 정보는 인스타그램을 참고하여 수기로 정리한 내용입니다. 실제 관리자가 지정되기 전까지는 반드시 한 번 더 확인해 주세요.`,
      'ㅤㅤㅤㅤㅤ',
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
        {NOTICE_TEXTS.map((noticeText, index) => (
          <Typography key={index} fontSize="0.875rem" color="white">
            {noticeText}
          </Typography>
        ))}
      </Marquee>
    </Box>
  );
}
