import { useEffect } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const placingIcon = L.divIcon({
  html: '<div class="placing-marker"></div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function PlacementMarker({ placedPos, onPlace }) {
  const map = useMapEvents({
    click(e) {
      onPlace({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    const container = map.getContainer();
    container.style.cursor = 'crosshair';
    return () => {
      container.style.cursor = '';
    };
  }, [map]);

  if (!placedPos) return null;

  return (
    <Marker
      position={[placedPos.lat, placedPos.lng]}
      icon={placingIcon}
      interactive={false}
    />
  );
}
