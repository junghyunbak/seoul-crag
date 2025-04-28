import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

interface ImageWithSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  image: Image;
}

export function ImageWithSource({ image, className }: ImageWithSourceProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
      }}
      className={className}
    >
      <Box
        component="img"
        src={image.url}
        sx={{
          width: '100%',
          userSelect: 'none',
          objectFit: 'cover',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          right: 8,
          bottom: 4,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: grey[400],
          }}
        >
          {`출처: ${image.source}`}
        </Typography>
      </Box>
    </div>
  );
}
