import { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';

interface ImageWithSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  image: Image;
  sourcePosition?: 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
}

export function ImageWithSource({ image, className, sourcePosition = 'leftBottom' }: ImageWithSourceProps) {
  const [loaded, setLoaded] = useState(false);

  const sourceInset: React.CSSProperties['inset'] = (() => {
    switch (sourcePosition) {
      case 'leftTop':
        return '0 auto auto 0';
      case 'leftBottom':
        return 'auto auto 0 0';
      case 'rightTop':
      case 'rightBottom':
      default:
        return undefined;
    }
  })();

  useEffect(() => {
    setLoaded(false);

    const img = new Image();

    img.onload = async () => {
      setLoaded(true);
    };

    img.src = image.url;
  }, [image]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
      }}
      className={className}
    >
      {loaded && (
        <>
          <Box
            component="img"
            src={image.url}
            sx={{
              width: '100%',
              objectFit: 'cover',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              inset: sourceInset,
              width: '100%',
              p: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={(theme) => ({
                margin: 0,
                color: theme.palette.grey[300],
                whiteSpace: 'normal',
                wordBreak: 'break-all',
                lineHeight: 1,
              })}
            >
              {`출처: ${image.source}`}
            </Typography>
          </Box>
        </>
      )}
    </div>
  );
}
