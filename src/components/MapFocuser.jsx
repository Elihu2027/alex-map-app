import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const OVERVIEW_CENTER = [45, -100];
const OVERVIEW_ZOOM = 4;

export default function MapFocuser({ feature }) {
  const map = useMap();
  const wasLockedRef = useRef(false);

  useEffect(() => {
    if (feature) {
      try {
        const bounds = L.geoJSON(feature).getBounds();
        if (!bounds.isValid()) return;
        const padded = bounds.pad(0.5);
        map.setMaxBounds(padded);
        const fitZoom = map.getBoundsZoom(bounds, false, [40, 40]);
        map.setMinZoom(Math.max(3, fitZoom - 1));
        map.flyToBounds(bounds, { duration: 0.8, padding: [40, 40] });
        wasLockedRef.current = true;
      } catch (e) {
        console.warn('MapFocuser focus error:', e);
      }
    } else if (wasLockedRef.current) {
      map.setMaxBounds(null);
      map.setMinZoom(3);
      map.flyTo(OVERVIEW_CENTER, OVERVIEW_ZOOM, { duration: 0.8 });
      wasLockedRef.current = false;
    }
  }, [feature, map]);

  return null;
}
