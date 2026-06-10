import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import RegionLayer from '../RegionLayer/RegionLayer';
import WaypointMarker from '../WaypointMarker/WaypointMarker';
import BackButton from '../BackButton/BackButton';
import UndoButton from '../UndoButton/UndoButton';
import MapFocuser from '../MapFocuser';
import AddLocationModal from '../AddLocation/AddLocationModal';
import PlacementMarker from '../AddLocation/PlacementMarker';
import EditLocationModal from '../EditLocation/EditLocationModal';
import ResetButton from '../ResetButton/ResetButton';
import './OverviewMap.css';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function OverviewMap({
  geoData, onRegionClick,
  focusedRegion, selectedFeature, waypoints,
  visited, onToggleVisited,
  onBack, onUndo, canUndo,
  completedRegions, onAddWaypoint, onEditWaypoint, onReset,
}) {
  // Add flow
  const [addStep, setAddStep] = useState(null);
  const [pendingLink, setPendingLink] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [placedPos, setPlacedPos] = useState(null);

  // Edit flow
  const [editingWaypoint, setEditingWaypoint] = useState(null);
  const [editStep, setEditStep] = useState(null); // 'form' | 'position'
  const [editName, setEditName] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editPos, setEditPos] = useState(null);

  // ── Add handlers ──────────────────────────────────────────────────────────
  const handleCancelAdd = useCallback(() => {
    setAddStep(null); setPendingLink(''); setPendingName(''); setPlacedPos(null);
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
    setAddStep(null); setPendingLink(''); setPendingName(''); setPlacedPos(null);
  }, [placedPos, pendingName, pendingLink, focusedRegion, onAddWaypoint]);

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const handleStartEdit = useCallback((wp) => {
    setEditingWaypoint(wp);
    setEditStep('form');
    setEditName(wp.name);
    setEditLink(wp.googleMapsUrl || '');
    setEditPos(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingWaypoint(null); setEditStep(null);
    setEditName(''); setEditLink(''); setEditPos(null);
  }, []);

  const handleSaveEdit = useCallback(() => {
    const changes = { name: editName.trim(), googleMapsUrl: editLink.trim() };
    if (editPos) { changes.lat = editPos.lat; changes.lng = editPos.lng; }
    onEditWaypoint(editingWaypoint.id, changes);
    setEditingWaypoint(null); setEditStep(null);
    setEditName(''); setEditLink(''); setEditPos(null);
  }, [editName, editLink, editPos, editingWaypoint, onEditWaypoint]);

  const handleChangePosition = useCallback(() => {
    setEditPos({ lat: editingWaypoint.lat, lng: editingWaypoint.lng });
    setEditStep('position');
  }, [editingWaypoint]);

  // ── Shared position-mode logic ────────────────────────────────────────────
  const inAddFlow = addStep !== null;
  const inEditFlow = editStep !== null;
  const inPositionMode = addStep === 'place' || editStep === 'position';
  const inAnyFlow = inAddFlow || inEditFlow;
  const showNormalUI = focusedRegion && !inAnyFlow;
  const showTitle = focusedRegion && !inAnyFlow;

  const posPlacedPos = addStep === 'place' ? placedPos : editPos;
  const posSetPlaced = addStep === 'place' ? setPlacedPos : setEditPos;
  const posConfirmDisabled = addStep === 'place' && !placedPos;
  const posInstruction = posPlacedPos
    ? 'Click to reposition · Confirm when ready'
    : 'Click on the map to place the waypoint';

  function handlePositionBack() {
    if (addStep === 'place') { setPlacedPos(null); setAddStep('name'); }
    else { setEditPos(null); setEditStep('form'); }
  }

  function handlePositionCancel() {
    if (addStep === 'place') handleCancelAdd(); else handleCancelEdit();
  }

  function handlePositionConfirm() {
    if (addStep === 'place') handleConfirmAdd(); else setEditStep('form');
  }

  return (
    <div className="overview-map">
      {!focusedRegion && !inAnyFlow && (
        <ResetButton onReset={onReset} />
      )}

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
        link={pendingLink} onLinkChange={setPendingLink}
        name={pendingName} onNameChange={setPendingName}
        onContinueFromLink={() => setAddStep('name')}
        onContinueFromName={() => setAddStep('place')}
        onBack={() => setAddStep('link')}
        onCancel={handleCancelAdd}
      />

      <EditLocationModal
        visible={editStep === 'form'}
        name={editName} onNameChange={setEditName}
        link={editLink} onLinkChange={setEditLink}
        positionChanged={editPos !== null}
        onChangePosition={handleChangePosition}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />

      {inPositionMode && (
        <>
          <button className="placement-btn placement-btn--back" onClick={handlePositionBack}>← Back</button>
          <div className="placement-instruction">{posInstruction}</div>
          <button className="placement-btn placement-btn--cancel" onClick={handlePositionCancel}>Cancel</button>
          <button
            className="placement-btn placement-btn--confirm"
            onClick={handlePositionConfirm}
            disabled={posConfirmDisabled}
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
        {focusedRegion && waypoints
          .filter(wp => !(editStep === 'position' && editingWaypoint?.id === wp.id))
          .map(wp => (
            <WaypointMarker
              key={wp.id}
              waypoint={wp}
              visited={Boolean(visited[wp.id])}
              onToggle={onToggleVisited}
              onEdit={handleStartEdit}
            />
          ))}
        {inPositionMode && (
          <PlacementMarker placedPos={posPlacedPos} onPlace={posSetPlaced} />
        )}
      </MapContainer>
    </div>
  );
}
