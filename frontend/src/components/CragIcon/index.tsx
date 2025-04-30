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

      <svg width={`${width}px`} viewBox="0 0 71 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M28.6868 2.97152L18.2033 20.4715C18.8645 21.8049 21.0868 24.3715 24.6868 23.9715H28.6868L35.1868 32.4715L43.0618 20.4715L32.1868 3.47152C30.5868 1.07152 29.1868 2.13819 28.6868 2.97152Z"
          fill={mountainTopBg}
        />

        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.18684 46.9715C1.68684 48.3049 1.88684 50.9715 6.68684 50.9715H65.6868C66.6868 50.9715 68.6868 50.1715 68.6868 46.9715L49.1868 16.4715C48.3534 15.1382 46.4868 13.2715 45.6868 16.4715L43.0618 20.4715L35.1868 32.4715L28.6868 23.9715H24.6868C21.0868 24.3715 18.8645 21.8049 18.2033 20.4715L2.18684 46.9715Z"
          fill={mountainBottomBg}
        />

        <path
          d="M35.1868 32.4715L28.6868 23.9715H24.6868C21.0868 24.3715 18.8645 21.8049 18.2033 20.4715M35.1868 32.4715L38.6868 36.9715C39.0201 37.4715 40.3868 38.4715 43.1868 38.4715H44.1868M35.1868 32.4715L43.0618 20.4715M18.2033 20.4715L28.6868 2.97152C29.1868 2.13819 30.5868 1.07152 32.1868 3.47152L43.0618 20.4715M18.2033 20.4715L2.18684 46.9715C1.68684 48.3049 1.88684 50.9715 6.68684 50.9715H65.6868C66.6868 50.9715 68.6868 50.1715 68.6868 46.9715L49.1868 16.4715C48.3534 15.1382 46.4868 13.2715 45.6868 16.4715L43.0618 20.4715M44.1868 38.4715H47.1868C47.0201 38.9715 46.3868 39.7715 45.1868 38.9715L44.1868 38.4715Z"
          stroke={borderColor}
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
