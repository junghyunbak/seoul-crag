interface CragIconProps {
  width: number;
  isSelect?: boolean;
  isClose?: boolean;
  counting?: boolean;
}

export function CragIcon({ width, isSelect = false, isClose = false, counting = false }: CragIconProps) {
  const mountainTopBg = (() => {
    if (isClose) {
      return 'white';
    }

    return '#F6EED6';
  })();

  const mountainBottomBg = (() => {
    if (isClose) {
      return '#848585';
    }

    return '#8A9969';
  })();

  const borderColor = (() => {
    if (isSelect) {
      return 'black';
    }

    if (isClose) {
      return '#515151';
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

      <svg width={`${width}px`} viewBox="0 0 82 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M33.1765 3.13079L20.9294 23.4998C21.7017 25.0517 24.2979 28.0392 28.5036 27.5736H33.1765L40.7701 37.4671L49.97 23.4998L37.2654 3.71276C35.3962 0.919304 33.7606 2.16084 33.1765 3.13079Z"
          fill={mountainTopBg}
        />

        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.21827 54.3442C1.63415 55.8962 1.8678 59 7.47535 59H76.4014C78.5197 59 80.8561 56.7053 79.6879 54.3442L57.1254 18.844C56.1519 17.2921 54.7889 15.9673 53.0366 18.844L49.97 23.4998L40.7701 37.4671L33.1765 27.5736H28.5036C24.2979 28.0392 21.7017 25.0517 20.9294 23.4998L2.21827 54.3442Z"
          fill={mountainBottomBg}
        />

        <path
          d="M40.7701 37.4671L33.1765 27.5736H28.5036C24.2979 28.0392 21.7017 25.0517 20.9294 23.4998M40.7701 37.4671L44.8589 42.7048C45.2483 43.2868 46.8449 44.4507 50.116 44.4507H51.2842M40.7701 37.4671L49.97 23.4998M20.9294 23.4998L33.1765 3.13079C33.7606 2.16084 35.3962 0.919304 37.2654 3.71276L49.97 23.4998M20.9294 23.4998L2.21827 54.3442C1.63415 55.8962 1.8678 59 7.47535 59H76.4014C78.5197 59 80.8561 56.7053 79.6879 54.3442L57.1254 18.844C56.1519 17.2921 54.7889 15.9673 53.0366 18.844L49.97 23.4998M51.2842 44.4507H54.7889C54.5942 45.0327 53.8544 45.9639 52.4525 45.0327L51.2842 44.4507Z"
          stroke={borderColor}
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
