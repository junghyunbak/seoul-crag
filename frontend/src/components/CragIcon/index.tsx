import { Box } from '@mui/material';

interface CragIconProps {
  width: number;
  isSelect?: boolean;
  isClose?: boolean;
  counting?: boolean;
}

export function CragIcon({ width, isSelect = false, isClose = false, counting = false }: CragIconProps) {
  const mountainTopBg = (() => {
    return '#F6EED6';
  })();

  const mountainBottomBg = (() => {
    return '#8A9969';
  })();

  const borderColor = (() => {
    if (isSelect) {
      return 'black';
    }

    return '#52634A';
  })();

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {counting && (
        <div
          className="count"
          style={{
            position: 'absolute',
            border: '3px solid #52634A',
            background: '#F6EED6',
            borderRadius: '50%',
            width: '30px',
            aspectRatio: '1/1',
            top: '-20px',
            zIndex: -1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            color: '#52634A',
          }}
        />
      )}

      {isClose && (
        <Box
          sx={{
            border: '1px solid #363d3e',
            py: 0.25,
            px: 0.4,
            fontSize: '0.5rem',
            fontWeight: 'bold',
            position: 'absolute',
            top: '20%',
            background: '#4f5555',
            borderRadius: '2px',
            color: 'white',
            transform: 'rotate(-5deg)',
          }}
        >
          CLOSED
        </Box>
      )}

      <svg width={`${width}px`} viewBox="0 0 90 69" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter={isSelect ? 'url(#filter0_d_366_2)' : ''}>
          <path
            d="M37.1765 3.13079L24.9294 23.4998C25.7017 25.0517 28.2979 28.0392 32.5036 27.5736H37.1765L44.7701 37.4671L53.97 23.4998L41.2654 3.71276C39.3962 0.919304 37.7606 2.16084 37.1765 3.13079Z"
            fill={mountainTopBg}
          />

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.21827 54.3442C5.63415 55.8962 5.8678 59 11.4753 59H80.4014C82.5197 59 84.8561 56.7053 83.6879 54.3442L61.1254 18.844C60.1519 17.2921 58.7889 15.9673 57.0366 18.844L53.97 23.4998L44.7701 37.4671L37.1765 27.5736H32.5036C28.2979 28.0392 25.7017 25.0517 24.9294 23.4998L6.21827 54.3442Z"
            fill={mountainBottomBg}
          />

          <path
            d="M44.7701 37.4671L37.1765 27.5736H32.5036C28.2979 28.0392 25.7017 25.0517 24.9294 23.4998M44.7701 37.4671L48.8589 42.7048C49.2483 43.2868 50.8449 44.4507 54.116 44.4507H55.2842M44.7701 37.4671L53.97 23.4998M24.9294 23.4998L37.1765 3.13079C37.7606 2.16084 39.3962 0.919304 41.2654 3.71276L53.97 23.4998M24.9294 23.4998L6.21827 54.3442C5.63415 55.8962 5.8678 59 11.4753 59H80.4014C82.5197 59 84.8561 56.7053 83.6879 54.3442L61.1254 18.844C60.1519 17.2921 58.7889 15.9673 57.0366 18.844L53.97 23.4998M55.2842 44.4507H58.7889C58.5942 45.0327 57.8544 45.9639 56.4525 45.0327L55.2842 44.4507Z"
            stroke={borderColor}
            strokeWidth={4}
          />
        </g>

        <defs>
          <filter
            id="filter0_d_366_2"
            x="0.000732422"
            y="-0.00115967"
            width="90.001"
            height="69.0012"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_366_2" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_366_2" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
