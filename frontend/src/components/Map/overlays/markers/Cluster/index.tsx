import { useContext, useEffect } from 'react';

import { renderToString } from 'react-dom/server';

import { mapContext } from '@/components/Map/index.context';

import { Box } from '@mui/material';

import { SIZE } from '@/constants';

import { MarkerIcon } from '../_assets/MarkerIcon';

interface ClusterProps {
  markers: naver.maps.Marker[];
  clusterMarkerBgColor?: string;
  maxZoom?: number;
  gridSize?: number;
}

export function Cluster({ markers, clusterMarkerBgColor, maxZoom = 11, gridSize = 100 }: ClusterProps) {
  const { map } = useContext(mapContext);

  useEffect(() => {
    const markerCluster = new MarkerClustering({
      map,
      markers,
      maxZoom,
      gridSize,
      disableClickZoom: false,
      icons: [
        {
          content: renderToString(
            <div
              style={{
                position: 'absolute',
              }}
            >
              <MarkerIcon.Inactive.Circle backgroundColor={clusterMarkerBgColor} width={SIZE.CRAG_MARKER_WIDTH} />
              <div
                className="count"
                style={{
                  position: 'absolute',
                  bottom: '-25%',
                  right: '-25%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  color: '#52634A',
                  textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
                }}
              />
            </div>
          ),
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
  }, [clusterMarkerBgColor, gridSize, map, markers, maxZoom]);

  return <Box />;
}
