import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function MapZoomer({ feature }) {
  const map = useMap();

  useEffect(() => {
    if (!feature) return;
    try {
      const bounds = L.geoJSON(feature).getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { duration: 1.0, padding: [40, 40] });
      }
    } catch (e) {
      console.warn('flyToBounds failed:', e);
    }
  }, [feature, map]);

  return null;
}
