import { useMap } from '@/hooks';

import { Molecules } from '@/components/molecules';

interface CragEdgeIndicatorsProps {
  crags: Crag[] | undefined;
}

export function CragEdgeIndicators({ crags }: CragEdgeIndicatorsProps) {
  const { enabledEdgeIndicator } = useMap();

  if (!enabledEdgeIndicator) {
    return null;
  }

  return <Molecules.EdgeIndicators crags={crags} />;
}
