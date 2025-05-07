import React from 'react';

import { Box, IconButton, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import ShowerIcon from '@mui/icons-material/Shower';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

import { motion, AnimatePresence } from 'framer-motion';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFilter } from '@/hooks';

const BASE_ANGLE = -135;
const RADIUS = 70;

type Feature = {
  icon: React.ReactNode;
  callback: () => void;
  disabled: boolean;
};

interface CragMenuProps {
  crag: Crag;
  isSelect: boolean;
}

export function CragMenu({ crag, isSelect }: CragMenuProps) {
  const [, setSelectCragDetailId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);
  const [, setShowerStory] = useQueryParam(QUERY_STRING.STORY_SHOWER, StringParam);
  const [, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);

  const theme = useTheme();

  const { isShowerExist, isScheduleExist } = useFilter(crag);

  const features: Feature[] = (() => {
    return [
      {
        icon: (
          <IconWrapper disable={!isScheduleExist}>
            <CalendarMonthIcon />
          </IconWrapper>
        ),
        callback: () => {
          setScheduleStory(crag.id);
        },
        disabled: !isScheduleExist,
      },
      {
        icon: (
          <IconWrapper disable={!isShowerExist}>
            <ShowerIcon />
          </IconWrapper>
        ),
        callback: () => {
          setShowerStory(crag.id);
        },
        disabled: !isShowerExist,
      },
      {
        icon: (
          <IconWrapper disable>
            <HourglassTopIcon />
          </IconWrapper>
        ),
        callback: () => {},
        disabled: false,
      },
      {
        icon: <InfoIcon color="primary" />,
        callback: () => {
          setSelectCragDetailId(crag.id);
        },
        disabled: false,
      },
    ];
  })();

  return (
    <AnimatePresence>
      {isSelect &&
        features.map((feature, index) => {
          const angleRad = ((BASE_ANGLE + index * 45) * Math.PI) / 180;

          const x = RADIUS * Math.cos(angleRad);
          const y = RADIUS * Math.sin(angleRad);

          return (
            <motion.div
              key={index}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x, y, opacity: 1 }}
              exit={{ x: 0, y: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                position: 'absolute',
                bottom: 0,
              }}
            >
              <IconButton
                sx={{
                  bgcolor: 'white',
                  boxShadow: 2,
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: grey[100] },
                  color: theme.palette.grey[600],
                  pointerEvents: feature.disabled ? 'none' : 'auto',
                }}
                onClick={feature.callback}
              >
                {feature.icon}
              </IconButton>
            </motion.div>
          );
        })}
    </AnimatePresence>
  );
}

interface IconWrapperProps extends React.PropsWithChildren {
  disable: boolean;
}

function IconWrapper({ disable, children }: IconWrapperProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
      {disable && (
        <Box
          sx={{
            position: 'absolute',
            width: '21px',
            borderTop: '2px solid white',
            borderBottom: '2px solid currentColor',
            transform: 'rotate(45deg)',
          }}
        />
      )}
    </Box>
  );
}
