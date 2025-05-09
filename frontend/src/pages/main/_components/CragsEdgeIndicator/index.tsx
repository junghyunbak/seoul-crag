import { useMap } from '@/hooks';

import { AngularEdgeMarkers } from '@/components/AngularEdgeMarkers';

interface CragsEdgeIndicatorProps {
  crags: Crag[] | undefined;
}

export function CragsEdgeIndicator({ crags }: CragsEdgeIndicatorProps) {
  const { enabledEdgeIndicator } = useMap();

  if (!enabledEdgeIndicator) {
    return null;
  }

  return <AngularEdgeMarkers crags={crags} />;
}
