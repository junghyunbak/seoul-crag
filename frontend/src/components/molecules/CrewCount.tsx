import React, { useEffect, useState } from 'react';

import { Box, Paper, Typography } from '@mui/material';

import { Atoms } from '@/components/atoms';

import { AnimatePresence, motion } from 'framer-motion';

export function CrewCount({ defaultCount, onChange }: { defaultCount: CrewCount; onChange(count: CrewCount): void }) {
  const [count, setCount] = useState<CrewCount>(defaultCount);

  useEffect(() => {
    /**
     * 애니메이션이 진행됨과 동시에 상태가 변하면
     *
     * 무거운 작업들이 실행됨에 따라 js 애니메이션이 끊기는 현상이 있어 딜레이추가
     */
    setTimeout(() => {
      onChange(count);
    }, 500);
  }, [count, onChange]);

  return (
    <Paper
      sx={{
        p: 0.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.4,
        height: 50,
        aspectRatio: '1/1',
        cursor: 'pointer',
      }}
      onClick={() => {
        const nextCount = (() => {
          if (count === 1) {
            return 5;
          } else if (count === 5) {
            return 10;
          } else {
            return 1;
          }
        })();

        setCount(nextCount);
      }}
    >
      <Atoms.Text.Title variant="body2">인원</Atoms.Text.Title>

      <Box
        sx={(theme) => ({
          background: `${theme.palette.info.light}aa`,
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 0.5,
          width: '100%',
          overflow: 'hidden',
        })}
      >
        <AnimatePresence>
          {(() => {
            if (count === 1) {
              return <CountText key="A">개인</CountText>;
            } else if (count === 5) {
              return <CountText key="B">{'≥' + count}</CountText>;
            } else if (count === 10) {
              return <CountText key="c">{'≥' + count}</CountText>;
            }
          })()}
        </AnimatePresence>
      </Box>
    </Paper>
  );
}

function CountText({ children }: React.PropsWithChildren) {
  return (
    <motion.div
      initial={{
        x: '100%',
      }}
      animate={{
        x: 0,
      }}
      exit={{
        x: '-100%',
      }}
      transition={{ duration: 0.4, ease: 'easeIn' }}
      style={{
        width: '100%',
      }}
    >
      <Typography
        variant="body2"
        sx={(theme) => ({
          color: theme.palette.info.dark,
          fontWeight: 'bold',
          width: '100%',
          textAlign: 'center',
        })}
      >
        {children}
      </Typography>
    </motion.div>
  );
}
