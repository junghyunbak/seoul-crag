import React from 'react';

import { IconButton, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import ShowerIcon from '@mui/icons-material/Shower';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

import { motion, AnimatePresence } from 'framer-motion';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFilter, useModifyCafe } from '@/hooks';
import { api } from '@/api/axios';
import { cafesSchema } from '@/schemas/cafe';
import { z } from 'zod';

const BASE_ANGLE = -180;
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
  const [, setOperationStory] = useQueryParam(QUERY_STRING.STORY_OPERATION, StringParam);

  const theme = useTheme();

  const { hasShower } = useFilter(crag);

  const { updateCafes } = useModifyCafe();

  // TODO: 일정 존재여부, 운영 시간 존재 여부에 따라 disabled 설정하기.
  const features: Feature[] = (() => {
    return [
      {
        icon: <LocalCafeIcon sx={{ color: '#b13f0e' }} />,
        callback: async () => {
          const { data } = await api.get(`/kakao-place/cafe?lat=${crag.latitude}&lng=${crag.longitude}&radius=500`);

          const res = z
            .object({
              documents: cafesSchema,
            })
            .parse(data);

          updateCafes(res.documents);
        },
        disabled: false,
      },
      {
        icon: <CalendarMonthIcon />,
        callback: () => {
          setScheduleStory(crag.id);
        },
        disabled: false,
      },
      {
        icon: <ShowerIcon />,
        callback: () => {
          setShowerStory(crag.id);
        },
        disabled: !hasShower,
      },
      {
        icon: <AccessTimeIcon />,
        callback: () => {
          setOperationStory(crag.id);
        },
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
                }}
                onClick={feature.callback}
                disabled={feature.disabled}
              >
                {feature.icon}
              </IconButton>
            </motion.div>
          );
        })}
    </AnimatePresence>
  );
}
