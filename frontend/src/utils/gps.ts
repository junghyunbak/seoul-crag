export function getGpsLatLng() {
  return new Promise<{ lat: number; lng: number } | null>((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {
            coords: { latitude, longitude },
          } = position;

          resolve({ lat: latitude, lng: longitude });
        },
        () => {
          resolve(null);
        }
      );
    } else {
      resolve(null);
    }
  });
}
