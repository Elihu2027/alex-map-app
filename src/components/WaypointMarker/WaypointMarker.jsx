import { Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';
import { createDefaultIcon, createVisitedIcon } from '../../utils/markerIcons';
import WaypointPopup from '../WaypointPopup/WaypointPopup';

export default function WaypointMarker({ waypoint, visited, onToggle }) {
  const icon = useMemo(
    () => (visited ? createVisitedIcon() : createDefaultIcon()),
    [visited]
  );

  return (
    <Marker position={[waypoint.lat, waypoint.lng]} icon={icon}>
      <Popup minWidth={200}>
        <WaypointPopup waypoint={waypoint} visited={visited} onToggle={onToggle} />
      </Popup>
    </Marker>
  );
}
