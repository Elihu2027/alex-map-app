import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import RegionLayer from '../RegionLayer/RegionLayer';
import WaypointMarker from '../WaypointMarker/WaypointMarker';
import BackButton from '../BackButton/BackButton';
import UndoButton from '../UndoButton/UndoButton';
import MapFocuser from '../MapFocuser';
import AddLocationModal from '../AddLocation/AddLocationModal';
import PlacementMarker from '../AddLocation/PlacementMarker';
import './OverviewMap.css';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function OverviewMap({
  geoData, onRegionClick,
  focusedRegion, selectedFeature, waypoints,
  visited, onToggleVisited,
  onBack, onUndo, canUndo,
  completedRegions, onAddWaypoint,
}) {
  const [addStep, setAddStep] = useState(null);
  const [pendingLink, setPendingLink] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [placedPos, setPlacedPos] = useState(null);

  const handleCancelAdd = useCallback(() => {
    setAddStep(null);
    setPendingLink('');
    setPendingName('');
    setPlacedPos(null);
  }, []);

  const handleConfirmAdd = useCallback(() => {
    if (!placedPos) return;
    onAddWaypoint({
      id: `custom-${Date.now()}`,
      name: pendingName.trim(),
      googleMapsUrl: pendingLink.trim(),
      lat: placedPos.lat,
      lng: placedPos.lng,
      region: focusedRegion,
      isCustom: true,
    });
    setAddStep(null);
    setPendingLink('');
    setPendingName('');
    setPlacedPos(null);
  }, [placedPos, pendingName, pendingLink, focusedRegion, onAddWaypoint]);

  const inAddFlow = addStep !== null;
  const showNormalUI = focusedRegion && !inAddFlow;
  const showTitle = focusedRegion && addStep !== 'link' && addStep !== 'name';

  return (
    <div className="overview-map">
      {showNormalUI && (
        <>
          <BackButton onBack={onBack} regionName={focusedRegion} />
          <UndoButton onUndo={onUndo} canUndo={canUndo} />
          <button className="add-location-trigger" onClick={() => setAddStep('link')}>
            + Add Location
          </button>
        </>
      )}

      {showTitle && (
        <div className="overview-map__region-title">{focusedRegion}</div>
      )}

      <AddLocationModal
        step={addStep}
        link={pendingLink}
        onLinkChange={setPendingLink}
        name={pendingName}
        onNameChange={setPendingName}
        onContinueFromLink={() => setAddStep('name')}
        onContinueFromName={() => setAddStep('place')}
        onBack={() => setAddStep('link')}
        onCancel={handleCancelAdd}
      />

      {addStep === 'place' && (
        <>
          <button className="placement-btn placement-btn--back" onClick={() => { setPlacedPos(null); setAddStep('name'); }}>
            ← Back
          </button>
          <div className="placement-instruction">
            {placedPos ? 'Click to reposition · Confirm when ready' : 'Click on the map to place the waypoint'}
          </div>
          <button className="placement-btn placement-btn--cancel" onClick={handleCancelAdd}>
            Cancel
          </button>
          <button
            className="placement-btn placement-btn--confirm"
            onClick={handleConfirmAdd}
            disabled={!placedPos}
          >
            ✓ Confirm
          </button>
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
        {addStep === 'place' && (
          <PlacementMarker placedPos={placedPos} onPlace={setPlacedPos} />
        )}
      </MapContainer>
    </div>
  );
}
