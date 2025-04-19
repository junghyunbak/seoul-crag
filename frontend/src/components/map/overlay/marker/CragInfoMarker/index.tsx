import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

import { useCrag, useMap, useModifyCrag } from '@/hooks';

import { faker } from '@faker-js/faker';

import { Box, Fab, IconButton } from '@mui/material';
import { Add, Shower, AccessTime, Event } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface CragInfoMarker {
  crag: Crag;
}

export function CragInfoMarker({ crag }: CragInfoMarker) {
  const { map } = useMap();
  const { selectCragId, cragMap } = useCrag();

  const [infoMarker, setInfoMarker] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const infoMarker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(crag.latitude, crag.longitude),
    });

    setInfoMarker(infoMarker);

    return function cleanup() {
      infoMarker.setMap(null);
    };
  }, [map, crag]);

  useEffect(() => {
    if (!infoMarker) {
      return;
    }

    const el = document.createElement('div');

    createRoot(el).render(<RadialMenu crag={crag} />);

    infoMarker.setIcon({
      content: el,
    });
  }, [cragMap, infoMarker, crag]);

  return <></>;
}

const features = [
  { icon: <Shower />, angle: -90 },
  { icon: <AccessTime />, angle: -45 },
  { icon: <Event />, angle: 0 },
];

const radius = 80;

interface RadialMenuProps {
  crag: Crag;
}

export function RadialMenu({ crag }: RadialMenuProps) {
  const { selectCragId } = useCrag();

  return (
    <AnimatePresence>
      {crag.id === selectCragId &&
        features.map((feature, index) => {
          const angleRad = (feature.angle * Math.PI) / 180;
          const x = radius * Math.cos(angleRad);
          const y = radius * Math.sin(angleRad);

          return (
            <motion.div
              key={index}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x, y, opacity: 1 }}
              exit={{ x: 0, y: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                position: 'absolute',
              }}
            >
              <IconButton
                sx={{
                  bgcolor: 'white',
                  boxShadow: 2,
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                {feature.icon}
              </IconButton>
            </motion.div>
          );
        })}
    </AnimatePresence>
  );
}
