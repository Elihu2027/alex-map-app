import { MapContainer, TileLayer } from 'react-leaflet';
import MapZoomer from '../MapZoomer';
import WaypointMarker from '../WaypointMarker/WaypointMarker';
import BackButton from '../BackButton/BackButton';
import UndoButton from '../UndoButton/UndoButton';
import { REGION_META } from '../../data/regionMeta';
import './RegionMap.css';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function RegionMap({ regionName, feature, waypoints, visited, onToggleVisited, onBack, onUndo, canUndo }) {
  const meta = REGION_META[regionName] || { center: [39, -96], defaultZoom: 5 };

  return (
    <div className="region-map">
      <BackButton onBack={onBack} regionName={regionName} />
      <UndoButton onUndo={onUndo} canUndo={canUndo} />
      <div className="region-map__title">{regionName}</div>
      <MapContainer
        center={meta.center}
        zoom={meta.defaultZoom}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        {feature && <MapZoomer feature={feature} />}
        {waypoints.map((wp) => (
          <WaypointMarker
            key={wp.id}
            waypoint={wp}
            visited={Boolean(visited[wp.id])}
            onToggle={onToggleVisited}
          />
        ))}
      </MapContainer>
    </div>
  );
}
