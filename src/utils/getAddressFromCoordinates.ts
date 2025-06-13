export default async function getAddressFromCoordinates(lat: number, lng: number): Promise<string | null> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.features && data.features.length > 0) {
    return data.features[0].place_name;
  }

  return null;
}