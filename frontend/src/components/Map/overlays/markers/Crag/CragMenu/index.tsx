import { useMemo } from 'react';

import { Box, IconButton, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import ShowerIcon from '@mui/icons-material/Shower';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { motion, AnimatePresence } from 'framer-motion';

import { useQueryParam, StringParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';

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

  const features = useMemo<Feature[]>(() => {
    const _features: Feature[] = [];

    _features.push({
      icon: <CalendarMonthIcon />,
      callback: () => {
        setScheduleStory(crag.id);
      },
      disabled: false,
    });

    _features.push({
      icon: (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ShowerIcon sx={{ position: 'absolute' }} />
          {!crag.imageTypes?.includes('shower') && (
            <Box
              sx={{
                position: 'absolute',
                width: '20px',
                borderTop: '2px solid white',
                borderBottom: '2px solid currentColor',
                transform: 'rotate(45deg)',
              }}
            />
          )}
        </Box>
      ),
      callback: () => {
        setShowerStory(crag.id);
      },
      disabled: crag.imageTypes ? !crag.imageTypes.includes('shower') : true,
    });

    _features.push({
      icon: <InfoIcon color="primary" />,
      callback: () => {
        setSelectCragDetailId(crag.id);
      },
      disabled: false,
    });

    return _features;
  }, [crag, setScheduleStory, setSelectCragDetailId, setShowerStory]);

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
