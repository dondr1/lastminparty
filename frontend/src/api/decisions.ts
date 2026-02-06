import { supabase } from "../../supabaseClient";

export async function insertEventDecision(
  event_id: number,
  decision: "like" | "nope",
) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    console.error("No active session");
    return;
  }

  const userId = sessionData.session.user.id;

  const { error } = await supabase.from("event_decisions").insert({
    user_id: userId,
    event_id: event_id,
    decision,
  });

  if (error) {
    console.error("insertEventDecision error:", error);
  }
}
