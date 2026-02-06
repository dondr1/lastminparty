import { supabase } from "../../supabaseClient";
import { isEventExpired } from "../utils/eventTime";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  image_url: string;
  is_invite_only: boolean;
  capacity: number;
  creator_id: string;
  created_at: string;
};

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, date, start_time, end_time, location")
    .order("created_at", { ascending: false });

  console.log("events data:", data);
  console.log("events error:", error);

  return (data ?? []).filter(
    (event) => !isEventExpired(event.date, event.end_time, event.start_time),
  );
}
