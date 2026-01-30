export const normalizeLocation = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) return [];

  return rawData.map((item) => ({
    displayLabel: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`,
    city: item.name,
    country: item.country,
    coords: {
      lat: item.lat,
      lon: item.lon
    }
  }));
};