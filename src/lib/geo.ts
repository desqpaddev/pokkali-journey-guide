export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export type Lang = "english" | "hindi" | "malayalam";
export const LANG_LABEL: Record<Lang, string> = {
  english: "English",
  hindi: "हिन्दी",
  malayalam: "മലയാളം",
};
export const LANG_LOCALE: Record<Lang, string> = {
  english: "en-US",
  hindi: "hi-IN",
  malayalam: "ml-IN",
};