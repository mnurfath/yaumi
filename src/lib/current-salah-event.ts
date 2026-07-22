import type { PrayerTime } from "./prayer-times";

export function currentSalahEvent(
  times: PrayerTime[],
  sunrise: Date,
  now: Date
): string {
  const fajr = times.find((t) => t.name === "Fajr")!.date;
  const dhuhr = times.find((t) => t.name === "Dhuhr")!.date;
  const asr = times.find((t) => t.name === "Asr")!.date;
  const maghrib = times.find((t) => t.name === "Maghrib")!.date;
  const isha = times.find((t) => t.name === "Isha")!.date;

  if (now < fajr) return "tahajjud";

  const sunriseEnd = new Date(sunrise.getTime() + 15 * 60 * 1000);
  if (now < sunriseEnd) return "fajr";
  if (now < dhuhr) return "dhuha";
  if (now < asr) return "dhuhr";
  if (now < maghrib) return "asr";
  if (now < isha) return "maghrib";

  const tomorrowFajr = new Date(fajr.getTime() + 86_400_000);
  const nightDuration = tomorrowFajr.getTime() - isha.getTime();
  const lastThirdStart = new Date(tomorrowFajr.getTime() - nightDuration / 3);

  if (now < lastThirdStart) return "isha";
  return "tahajjud";
}