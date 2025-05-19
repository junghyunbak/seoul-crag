import { useRef, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import LocationPinIcon from '@mui/icons-material/LocationPin';

import { useFloating, autoUpdate, arrow, FloatingArrow } from '@floating-ui/react';

interface CafeInfoProps {
  cafe: Cafe;
  referenceRef: React.RefObject<HTMLDivElement | null>;
}

export function CafeInfo({ cafe, referenceRef }: CafeInfoProps) {
  const arrowRef = useRef(null);

  const { refs, floatingStyles, update, context } = useFloating({
    placement: 'top',
    onOpenChange: () => {},
    middleware: [arrow({ element: arrowRef })],
  });

  useEffect(() => {
    refs.setReference(referenceRef.current);
  }, [refs, referenceRef]);

  const {
    reference: { current: refRef },
    floating: { current: floatRef },
  } = refs;

  useEffect(() => {
    if (!refRef || !floatRef) {
      return;
    }

    const cleanup = autoUpdate(refRef, floatRef, update);

    return cleanup;
  }, [floatRef, refRef, update]);

  return (
    <Box
      style={floatingStyles}
      ref={refs.setFloating}
      onClick={() => {
        window.open(cafe.place_url, '_blank');
      }}
    >
      <Box
        sx={{
          background: '#e0dd49',
          borderRadius: 1,
          p: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <LocationPinIcon
          sx={{
            color: '#0079f7',
          }}
        />
        <Typography color="black">
          kakao<strong>map </strong> 에서 보기
        </Typography>
      </Box>

      <FloatingArrow ref={arrowRef} context={context} fill={'#e0dd49'} />
    </Box>
  );
}
