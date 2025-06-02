import { useEffect } from 'react';

import { getGpsLatLng } from '@/utils';

import { useModifyMap } from '@/hooks/useModifyMap';

export function useSetupGps() {
  const { updateGpsLatLng } = useModifyMap();

  useEffect(() => {
    (async () => {
      const latLng = await getGpsLatLng();

      if (!latLng) {
        return;
      }

      updateGpsLatLng(latLng.lat, latLng.lng);
    })();
  }, [updateGpsLatLng]);
}
