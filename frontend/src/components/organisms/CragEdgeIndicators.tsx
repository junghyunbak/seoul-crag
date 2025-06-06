import { useMap } from '@/hooks';

import { Molecules } from '@/components/molecules';

interface CragEdgeIndicatorsProps {
  crags: Crag[] | undefined;
}

export function CragEdgeIndicators({ crags }: CragEdgeIndicatorsProps) {
  const { enabledEdgeIndicator } = useMap();

  console.log(crags?.length, enabledEdgeIndicator);

  if (!enabledEdgeIndicator) {
    return null;
  }

  return <Molecules.EdgeIndicators crags={crags} />;
}
