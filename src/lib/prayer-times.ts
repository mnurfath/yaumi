const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof PRAYERS)[number];

type PrayerTime = { name: PrayerName; date: Date };

function dateParam(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

// API returns "HH:mm" 24h strings, sometimes with a " (EET)" suffix.
function parseTime(hhmm: string): Date {
  const [h, m] = hhmm.slice(0, 5).split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

async function getCoords(): Promise<GeolocationCoordinates | null> {
  try {
    const cached = localStorage.getItem("yaumi-prayer-loc");
    if (cached) {
      const { lat, lng } = JSON.parse(cached);
      return { latitude: lat, longitude: lng } as GeolocationCoordinates;
    }
  } catch {
    // corrupt cache — refetch below
  }

  if (!("geolocation" in navigator)) return null;

  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 8000,
        maximumAge: 86_400_000,
      })
    );
    localStorage.setItem(
      "yaumi-prayer-loc",
      JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    );
    return pos.coords;
  } catch {
    return null;
  }
}

async function fetchTimes(): Promise<{
  times: PrayerTime[];
  sunrise: Date;
  isFallback: boolean;
}> {
  const coords = await getCoords();
  const date = dateParam(new Date());
  const locKey = coords
    ? `${coords.latitude.toFixed(2)},${coords.longitude.toFixed(2)}`
    : "mecca";
  // ponytail: v2 prefix drops stale v1 caches; not worth migrating.
  const cacheKey = `yaumi-prayer-times-v2-${date}-${locKey}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const raw = JSON.parse(cached) as {
        times: { name: PrayerName; hhmm: string }[];
        sunrise: string;
      };
      return {
        times: revive(raw.times),
        sunrise: parseTime(raw.sunrise),
        isFallback: !coords,
      };
    }
  } catch {
    // corrupt cache — refetch below
  }

  const url = coords
    ? `https://api.aladhan.com/v1/timings/${date}?latitude=${coords.latitude}&longitude=${coords.longitude}`
    : `https://api.aladhan.com/v1/timingsByCity/${date}?city=Mecca&country=Saudi%20Arabia`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan ${res.status}`);
  const json = await res.json();
  const timings = json.data.timings as Record<string, string>;

  const raw: { name: PrayerName; hhmm: string }[] = PRAYERS.map((name) => ({
    name,
    hhmm: timings[name].slice(0, 5),
  }));
  const sunriseHhmm = timings.Sunrise.slice(0, 5);
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ times: raw, sunrise: sunriseHhmm })
    );
  } catch {
    // storage full — times still work for this session
  }

  return {
    times: raw.map((t) => ({ name: t.name, date: parseTime(t.hhmm) })),
    sunrise: parseTime(sunriseHhmm),
    isFallback: !coords,
  };
}

function revive(
  raw: { name: PrayerName; hhmm: string }[]
): PrayerTime[] {
  return raw.map((t) => ({ name: t.name, date: parseTime(t.hhmm) }));
}

export { PRAYERS, type PrayerName, type PrayerTime, dateParam, parseTime, getCoords, fetchTimes, revive };