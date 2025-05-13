import { useContext, useEffect } from 'react';

import { renderToString } from 'react-dom/server';

import { mapContext } from '@/components/Map/index.context';

import { Box } from '@mui/material';

import { CragIcon } from '@/components/CragIcon';

import { SIZE } from '@/constants';

interface ClusterProps {
  markers: naver.maps.Marker[];
}

export function Cluster({ markers }: ClusterProps) {
  const { map } = useContext(mapContext);

  useEffect(() => {
    const markerCluster = new MarkerClustering({
      map,
      markers,
      maxZoom: 11,
      gridSize: 100,
      disableClickZoom: false,
      icons: [
        {
          content: renderToString(
            <div
              style={{
                position: 'absolute',
              }}
            >
              <CragIcon width={SIZE.CRAG_MARKER_WIDTH} />
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
  }, [map, markers]);

  return <Box />;
}
