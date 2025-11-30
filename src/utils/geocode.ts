export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );
    const data = await res.json();
    return data.display_name || "Unable to detect exact location";
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "Error detecting location";
  }
}