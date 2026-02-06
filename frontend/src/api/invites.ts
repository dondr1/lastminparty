import { supabase } from "../../supabaseClient";
import { InviteItem } from "../types/Invite";
export async function createInvite(eventUuid: string) {
  //get curr user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const { data: existingInvite, error: checkError } = await supabase
    .from("event_invites")
    .select("id")
    .eq("event_uuid", eventUuid)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existingInvite) {
    return;
  }

  const { error } = await supabase.from("event_invites").insert({
    event_uuid: eventUuid,
    user_id: user.id,
    status: "pending",
  });
  if (error) {
    throw error;
  }
}

export async function fetchMyInvites(): Promise<InviteItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("event_invites")
    .select(
      `
      id,
      status,
      event:events!event_invites_event_uuid_fkey!inner (
        uuid_id,
        title,
        host:profiles!events_creator_id_fkey (
          id,
          username,
          avatar_url
        )
      )
    `
    )
    .eq("user_id", user.id)
    .returns<InviteItem[]>();

  if (error || !data) {
    console.error("fetchMyInvites error:", error);
    return [];
  }

  //  NORMALIZE HERE
  return data.map((invite) => {
    const event = invite.event;
    const host = event.host;

    return {
      id: invite.id,
      status: invite.status,
      event: {
        uuid_id: event.uuid_id,
        title: event.title,
        host: {
          id: host.id,
          username: host.username,
          avatar_url: host.avatar_url,
        },
      },
    };
  });
}

//UPDATE INVITE STATUS by invite.id
export async function updateInviteStatus(
  inviteId: number,
  status: "accepted" | "rejected"
) {
  const { error } = await supabase
    .from("event_invites")
    .update({ status })
    .eq("id", inviteId);
  if (error) {
    console.error("updateInviteStatus error:", error);
    throw error;
  }
}

//add participant that has accepted invite
export async function acceptInvite(eventUuid: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const { error: participantError } = await supabase
    .from("event_participants")
    .insert({ event_uuid: eventUuid, user_id: user.id });
  if (participantError) throw participantError;
}
