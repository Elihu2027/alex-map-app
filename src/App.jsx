import { useState, useEffect, useCallback, useMemo } from 'react';
import { useVisited } from './hooks/useVisited';
import { useCustomWaypoints } from './hooks/useCustomWaypoints';
import { buildCombinedGeoJSON, getRegionName } from './utils/geoUtils';
import { WAYPOINTS } from './data/waypoints';
import OverviewMap from './components/OverviewMap/OverviewMap';
import './App.css';

const US_STATES_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
const CA_PROVINCES_URL =
  'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson';

export default function App() {
  const [geoData, setGeoData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const { visited, toggle, undo, canUndo } = useVisited();
  const { customWaypoints, addWaypoint } = useCustomWaypoints();

  useEffect(() => {
    Promise.all([
      fetch(US_STATES_URL).then((r) => r.json()),
      fetch(CA_PROVINCES_URL).then((r) => r.json()),
    ])
      .then(([usStates, caProvinces]) => {
        setGeoData(buildCombinedGeoJSON(usStates, caProvinces));
      })
      .catch((err) => {
        console.error('Failed to load map data:', err);
        setLoadError('Failed to load map data. Please check your internet connection and refresh.');
      });
  }, []);

  const handleRegionClick = useCallback((name) => {
    setSelectedRegion(name);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedRegion(null);
  }, []);

  const allWaypoints = useMemo(() => {
    const merged = {};
    for (const [region, wps] of Object.entries(WAYPOINTS)) {
      merged[region] = [...wps];
    }
    for (const wp of customWaypoints) {
      if (!merged[wp.region]) merged[wp.region] = [];
      merged[wp.region] = [...merged[wp.region], wp];
    }
    return merged;
  }, [customWaypoints]);

  const selectedFeature = useMemo(() => {
    if (!selectedRegion || !geoData) return null;
    return geoData.features.find((f) => getRegionName(f) === selectedRegion) ?? null;
  }, [selectedRegion, geoData]);

  const selectedWaypoints = useMemo(() => {
    if (!selectedRegion) return [];
    return allWaypoints[selectedRegion] ?? [];
  }, [selectedRegion, allWaypoints]);

  const completedRegions = useMemo(() =>
    new Set(
      Object.entries(allWaypoints)
        .filter(([, wps]) => wps.length > 0 && wps.every(wp => visited[wp.id]))
        .map(([region]) => region)
    ),
  [visited, allWaypoints]);

  if (loadError) {
    return (
      <div className="loading">
        <span>⚠️</span>
        <span className="loading-error">{loadError}</span>
      </div>
    );
  }

  if (!geoData) {
    return <div className="loading">Loading map data…</div>;
  }

  return (
    <div className="app">
      <OverviewMap
        geoData={geoData}
        onRegionClick={handleRegionClick}
        focusedRegion={selectedRegion}
        selectedFeature={selectedFeature}
        waypoints={selectedWaypoints}
        visited={visited}
        onToggleVisited={toggle}
        onBack={handleBack}
        onUndo={undo}
        canUndo={canUndo}
        completedRegions={completedRegions}
        onAddWaypoint={addWaypoint}
      />
    </div>
  );
}
