import { useState, useEffect } from 'react';

import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

interface ImageWithSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  image: Image;
}

export function ImageWithSource({ image, className }: ImageWithSourceProps) {
  const [loaded, setLoaded] = useState(false);

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
        <Box
          component="img"
          src={image.url}
          sx={{
            width: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          p: 1,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            lineHeight: '0.75rem',
            color: grey[400],
            whiteSpace: 'normal',
            wordBreak: 'break-all',
          }}
        >
          {`출처: ${image.source}`}
        </p>
      </Box>
    </div>
  );
}
