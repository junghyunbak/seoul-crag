import { useMap } from '@/hooks';
import { AngularEdgeMarkers } from '@/components/AngularEdgeMarkers';

export function GpsEdgeIndicator() {
  const { gpsLatLng, enabledGpsIndicator } = useMap();

  const { lat, lng } = gpsLatLng;

  if (lat === -1 || lng === -1 || !enabledGpsIndicator) {
    return null;
  }

  return (
    <AngularEdgeMarkers
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
          contributions: [],
        },
      ]}
    />
  );
}
