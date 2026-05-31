import { MapContainer, TileLayer } from 'react-leaflet';
import RegionLayer from '../RegionLayer/RegionLayer';
import './OverviewMap.css';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function OverviewMap({ geoData, onRegionClick }) {
  return (
    <div className="overview-map">
      <MapContainer
        center={[45, -100]}
        zoom={4}
        minZoom={3}
        maxZoom={12}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        <RegionLayer geoData={geoData} onRegionClick={onRegionClick} />
      </MapContainer>
    </div>
  );
}
