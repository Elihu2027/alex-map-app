import { MapContainer, TileLayer } from 'react-leaflet';
import RegionLayer from '../RegionLayer/RegionLayer';
import WaypointMarker from '../WaypointMarker/WaypointMarker';
import BackButton from '../BackButton/BackButton';
import UndoButton from '../UndoButton/UndoButton';
import MapFocuser from '../MapFocuser';
import './OverviewMap.css';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function OverviewMap({
  geoData, onRegionClick,
  focusedRegion, selectedFeature, waypoints,
  visited, onToggleVisited,
  onBack, onUndo, canUndo,
  completedRegions,
}) {
  return (
    <div className="overview-map">
      {focusedRegion && (
        <>
          <BackButton onBack={onBack} regionName={focusedRegion} />
          <UndoButton onUndo={onUndo} canUndo={canUndo} />
          <div className="overview-map__region-title">{focusedRegion}</div>
        </>
      )}
      <MapContainer
        center={[45, -100]}
        zoom={4}
        minZoom={3}
        maxZoom={12}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        <MapFocuser feature={selectedFeature} />
        <RegionLayer
          geoData={geoData}
          onRegionClick={onRegionClick}
          focusedRegion={focusedRegion}
          completedRegions={completedRegions}
        />
        {focusedRegion && waypoints.map(wp => (
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
