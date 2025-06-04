import { useContext, useEffect } from 'react';

import { renderToString } from 'react-dom/server';

import { mapContext } from '@/components/molecules/Map/index.context';

import { Box } from '@mui/material';

import { SIZE } from '@/constants';

import { Molecules } from '@/components/molecules';

interface ClusterProps {
  markers: naver.maps.Marker[];
  maxZoom?: number;
  gridSize?: number;
  varient?: 'crag' | 'cafe';
}

export function Cluster({ markers, varient = 'crag', maxZoom = 11, gridSize = 100 }: ClusterProps) {
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
              <Molecules.CragIcon
                width={(varient === 'crag' ? SIZE.CRAG_MARKER_WIDTH : SIZE.CAFE_MARKER_WIDTH) * 0.8}
                varient={varient}
              />
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
  }, [gridSize, map, markers, maxZoom, varient]);

  return <Box />;
}
