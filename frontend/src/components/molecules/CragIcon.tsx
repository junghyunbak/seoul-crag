import { Atoms } from '@/components/atoms';

interface CragIconProps {
  width: number;
  isSelect?: boolean;
  isClose?: boolean;
  isRect?: boolean;
  isUnique?: boolean;
  varient?: 'crag' | 'cafe';
}

export function CragIcon({
  width,
  isSelect = false,
  isClose = false,
  isRect = false,
  isUnique,
  varient = 'crag',
}: CragIconProps) {
  const brightness = (() => {
    let brightness = 1;

    if (isUnique) {
      brightness += 0.2;
    }

    return `brightness(${brightness})`;
  })();

  const grayscale = (() => {
    return `grayscale(${isClose ? 1 : 0})`;
  })();

  const Icon = (() => {
    if (isSelect) {
      return <Atoms.Icon.ActiveMarker width={width} />;
    }

    if (isRect) {
      return <Atoms.Icon.SquareMarker width={width} />;
    }

    return <Atoms.Icon.CircleMarker width={width} />;
  })();

  return (
    <div
      style={
        {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          filter: `${brightness} ${grayscale}`,
          '--marker-bg-color': varient === 'crag' ? '#6D8C57' : '#b13f0e',
          '--marker-mountain-color': varient === 'crag' ? '#93A667' : '#e26e3b',
        } as React.CSSProperties
      }
    >
      {Icon}
    </div>
  );
}
