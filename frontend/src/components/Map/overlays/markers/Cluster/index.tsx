import { useContext, useEffect } from 'react';

import { renderToString } from 'react-dom/server';

import { mapContext } from '@/components/Map/index.context';

import { Box } from '@mui/material';

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
