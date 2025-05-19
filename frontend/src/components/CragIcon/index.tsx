import { MarkerIcon } from '../Map/overlays/markers/_assets/MarkerIcon';

interface CragIconProps {
  width: number;
  isSelect?: boolean;
  isClose?: boolean;
  isRect?: boolean;
}

export function CragIcon({ width, isSelect = false, isClose = false, isRect = false }: CragIconProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        filter: isClose ? 'brightness(0.7)' : undefined,
      }}
    >
      {isSelect ? (
        <MarkerIcon.Active width={width} />
      ) : isRect ? (
        <MarkerIcon.Inactive.Square width={width} />
      ) : (
        <MarkerIcon.Inactive.Circle width={width} />
      )}
    </div>
  );
}
