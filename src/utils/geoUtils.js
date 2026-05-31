const US_EXCLUDE = new Set(['District of Columbia', 'Puerto Rico', 'American Samoa',
  'Guam', 'United States Virgin Islands', 'Northern Mariana Islands']);

const CA_TARGET = new Set(['British Columbia', 'Ontario', 'Quebec', 'Québec']);

export function getRegionName(feature) {
  const p = feature.properties;
  const raw = p.name || p.NAME || p.province || p.PROVINCE || '';
  if (raw === 'Québec') return 'Quebec';
  return raw;
}

export function buildCombinedGeoJSON(usStatesRaw, caProvincesRaw) {
  const usFeatures = usStatesRaw.features.filter(
    (f) => !US_EXCLUDE.has(f.properties.name || f.properties.NAME || '')
  );
  const caFeatures = caProvincesRaw.features.filter((f) => {
    const name = f.properties.name || f.properties.NAME || f.properties.province || '';
    return CA_TARGET.has(name);
  });
  return {
    type: 'FeatureCollection',
    features: [...usFeatures, ...caFeatures],
  };
}
