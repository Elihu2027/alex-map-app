import { GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import { getRegionName } from '../../utils/geoUtils';
import { REGION_META } from '../../data/regionMeta';
import './RegionLayer.css';

const defaultStyle = {
  fillColor: '#4f46e5',
  fillOpacity: 0.12,
  color: '#4338ca',
  weight: 1.5,
};

const focusedStyle = {
  fillColor: '#4f46e5',
  fillOpacity: 0.22,
  color: '#4338ca',
  weight: 3,
};

const dimmedStyle = {
  fillColor: '#94a3b8',
  fillOpacity: 0.04,
  color: '#cbd5e1',
  weight: 0.5,
};

const hoverStyle = {
  fillOpacity: 0.32,
  weight: 2.5,
};

const checkIcon = L.divIcon({
  html: '<div class="region-complete-badge">✓</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function RegionLayer({ geoData, onRegionClick, focusedRegion, completedRegions = new Set() }) {
  function styleFeature(feature) {
    if (!focusedRegion) return defaultStyle;
    return getRegionName(feature) === focusedRegion ? focusedStyle : dimmedStyle;
  }

  function onEachFeature(feature, layer) {
    const name = getRegionName(feature);
    const isFocused = focusedRegion === name;

    if (!focusedRegion || isFocused) {
      layer.bindTooltip(name, {
        permanent: true,
        direction: 'center',
        className: 'region-label',
        interactive: false,
      });
    }

    if (focusedRegion) return;

    layer.on({
      click: () => onRegionClick(name),
      mouseover: (e) => e.target.setStyle(hoverStyle),
      mouseout: (e) => e.target.setStyle(defaultStyle),
    });
  }

  return (
    <>
      <GeoJSON
        key={focusedRegion ?? 'overview'}
        data={geoData}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
      {[...completedRegions].filter(name => REGION_META[name]).map(name => (
        <Marker
          key={name}
          position={REGION_META[name].center}
          icon={checkIcon}
          interactive={false}
        />
      ))}
    </>
  );
}
