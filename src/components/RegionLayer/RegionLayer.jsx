import { GeoJSON } from 'react-leaflet';
import { getRegionName } from '../../utils/geoUtils';

const defaultStyle = {
  fillColor: '#4f46e5',
  fillOpacity: 0.12,
  color: '#4338ca',
  weight: 1.5,
};

const hoverStyle = {
  fillOpacity: 0.32,
  weight: 2.5,
};

export default function RegionLayer({ geoData, onRegionClick }) {
  function onEachFeature(feature, layer) {
    const name = getRegionName(feature);

    layer.bindTooltip(name, {
      permanent: true,
      direction: 'center',
      className: 'region-label',
      interactive: false,
    });

    layer.on({
      click: () => onRegionClick(name),
      mouseover: (e) => e.target.setStyle(hoverStyle),
      mouseout: (e) => e.target.setStyle(defaultStyle),
    });
  }

  return (
    <GeoJSON
      data={geoData}
      style={defaultStyle}
      onEachFeature={onEachFeature}
    />
  );
}
