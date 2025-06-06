import { useMap } from '@/hooks';

import { EdgeIndicators } from '../molecules/EdgeIndicators';

export function GpsEdgeIndicators() {
  const { gpsLatLng, enabledGpsIndicator } = useMap();

  const { lat, lng } = gpsLatLng;

  if (lat === -1 || lng === -1 || !enabledGpsIndicator) {
    return null;
  }

  return (
    <EdgeIndicators
      indicatorColor="#44a1f6"
      type="gps"
      crags={[
        {
          id: '',
          name: '',
          short_name: null,
          description: '',
          latitude: lat,
          longitude: lng,
          website_url: null,
          created_at: new Date(),
          updated_at: new Date(),
          is_outer_wall: false,
          shower_url: '',
          gymUserContributions: [],
          thumbnail_url: null,
          area: null,
          images: [],
          schedules: [],
          openingHours: [],
          gymTags: [],
          gymDiscounts: [],
          price: 0,
        },
      ]}
    />
  );
}
