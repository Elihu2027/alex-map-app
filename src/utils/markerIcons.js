import L from 'leaflet';

export function createDefaultIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="marker-pin">
      <div class="marker-pin__dot"></div>
      <div class="marker-pin__tail"></div>
    </div>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -42],
  });
}

export function createVisitedIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="marker-pin marker-pin--visited">
      <div class="marker-pin__dot marker-pin__dot--visited">
        <span class="marker-pin__check">✓</span>
      </div>
      <div class="marker-pin__tail"></div>
    </div>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -42],
  });
}
