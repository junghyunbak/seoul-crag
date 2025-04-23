import { useContext, useEffect } from 'react';

import { renderToString } from 'react-dom/server';

import { mapContext } from '@/components/Map/index.context';
import { CragIcon } from '@/components/CragIcon';

import { Box } from '@mui/material';

import { CRAG_CLUSTER_MARKER_SIZE } from '@/constants/size';

import './markerClustering';

interface ClusterProps {
  markers: naver.maps.Marker[];
}

export function Cluster({ markers }: ClusterProps) {
  const { map } = useContext(mapContext);

  useEffect(() => {
    const markerCluster = new MarkerClustering({
      map,
      markers,
      maxZoom: 12,
      gridSize: 70,
      disableClickZoom: false,
      icons: [
        {
          content: renderToString(<CragIcon width={CRAG_CLUSTER_MARKER_SIZE} counting />),
        },
      ],
      indexGenerator: [0],
      stylingFunction(clusterMarker, count) {
        const $clusterEl = clusterMarker.getElement();

        const $countEl = $clusterEl.querySelector('.count');

        if ($countEl instanceof HTMLElement) {
          $countEl.innerText = count.toString();
        }
      },
    });

    return function cleanup() {
      markerCluster.setMap(null);
    };
  }, [map, markers]);

  return <Box />;
}
