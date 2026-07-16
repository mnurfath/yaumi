import { createClient } from "./server";
import type { Adhkar, SalahEvent, TimingType } from "@/types/database";

export async function getAdhkarsForSalahEvent(
  eventSlug: string
): Promise<Adhkar[]> {
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("salah_events")
    .select("id")
    .eq("slug", eventSlug)
    .single();

  if (eventError) throw eventError;

  const { data, error } = await supabase
    .from("adhkar_salah_events")
    .select("adhkars(*)")
    .eq("salah_event_id", event.id)
    .order("display_order", { foreignTable: "adhkars", ascending: true });

  if (error) throw error;
  return data.map((row) => row.adhkars as unknown as Adhkar);
}

export async function getAdhkarsByTimingType(
  timingType: TimingType
): Promise<Adhkar[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("adhkars")
    .select("*")
    .eq("timing_type", timingType)
    .order("display_order");

  if (error) throw error;
  return data;
}

export async function getSalahEvents(): Promise<SalahEvent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salah_events")
    .select("*")
    .order("display_order");

  if (error) throw error;
  return data;
}

export async function getSalahEventBySlug(
  slug: string
): Promise<SalahEvent | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salah_events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRecommendedAdhkars(
  eventSlug: string
): Promise<{ event: SalahEvent; adhkars: Adhkar[] }> {
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("salah_events")
    .select("*")
    .eq("slug", eventSlug)
    .single();

  if (eventError) throw eventError;

  const { data: mappings, error: mappingError } = await supabase
    .from("adhkar_salah_events")
    .select("adhkars(*)")
    .eq("salah_event_id", event.id)
    .order("display_order", { foreignTable: "adhkars", ascending: true });

  if (mappingError) throw mappingError;

  return {
    event,
    adhkars: mappings.map((row) => row.adhkars as unknown as Adhkar),
  };
}
