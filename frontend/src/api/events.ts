import { supabase } from "../../supabaseClient";
import { EventItem } from "../types/Event";
import { isEventExpired } from "../utils/eventTime";

export async function fetchEvents(): Promise<EventItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("events")
    .select(
      `
      id,
      uuid_id,
      title,
      description,
      date,
      start_time,
      end_time,
      location,
      image_url,
      is_invite_only,
      capacity,
      created_at,
      profiles:creator_id (
        id,
        username,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (user?.id) {
    query = query.neq("creator_id", user.id);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("fetchEvents error:", error);
    return [];
  }

  return data
    .map((event) => {
      const creator = Array.isArray(event.profiles)
        ? event.profiles[0]
        : event.profiles;

      return {
        id: event.id,
        uuid_id: event.uuid_id,
        title: event.title,
        description: event.description,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        image_url: event.image_url,
        is_invite_only: event.is_invite_only,
        capacity: event.capacity,
        created_at: event.created_at,

        creator,
      };
    })
    .filter(
      (event) => !isEventExpired(event.date, event.end_time, event.start_time),
    );
}

// export async function fetchAttendingEvents() {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) {
//     throw new Error("User not authenticated!");
//   }
//   const { data, error } = await supabase
//     .from("event_participants")
//     .select(
//       `
//       event:events!event_participants_event_uuid_fkey (
//         uuid_id,
//         title,
//         date,
//         is_invite_only,
//         host:profiles!events_creator_id_fkey (
//           username,
//           avatar_url
//         )
//       )
//       `,
//     )
//     .eq("user_id", user.id);

//   if (error || !data) {
//     console.error("fetchAttendingEvents error:", error);
//     return [];
//   }

//   // Normalize (VERY IMPORTANT)
//   return data.map((row) => {
//     const eventRow = row.event?.[0];
//     const hostRow = eventRow?.host?.[0];

//     return {
//       uuid_id: eventRow?.uuid_id ?? "",
//       title: eventRow?.title ?? "",
//       date: eventRow?.date ?? "",
//       is_invite_only: eventRow?.is_invite_only ?? false,
//       host: {
//         username: hostRow?.username ?? "",
//         avatar_url: hostRow?.avatar_url ?? "",
//       },
//     };
//   });
// }

// export async function fetchHostingEvents() {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) {
//     throw new Error("User not authenticated!");
//   }

//   const { data, error } = await supabase
//     .from("events")
//     .select(
//       `
//       uuid_id,
//       title,
//       date,
//       is_invite_only
//     `,
//     )
//     .eq("creator_id", user.id);

//   if (error || !data) {
//     console.error("fetchHostingEvents error:", error);
//     return [];
//   }

//   //  Normalize (pattern consistent)
//   return data.map((event) => ({
//     uuid_id: event.uuid_id,
//     title: event.title,
//     date: event.date,
//     is_invite_only: event.is_invite_only,
//   }));
// }

export async function fetchUsersWhoLikedMyEvent(eventUuid: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("event_decisions")
    .select(
      `
      user_id,
      profile:profiles!event_decisions_user_id_fkey (
        id,
        username,
        avatar_url
      )
    `,
    )
    .eq("event_uuid", eventUuid)
    .eq("decision", "like");

  if (error || !data) {
    console.error("fetchUsersWhoLikedMyEvent error:", error);
    return [];
  }

  // normalize (profiles always come back as array)
  return data.map((row) => ({
    user_id: row.user_id,
    id: row.profile?.[0]?.id ?? "",
    username: row.profile?.[0]?.username ?? "",
    avatar_url: row.profile?.[0]?.avatar_url ?? "",
  }));
}

//**CREATE EVENT **/

export async function createEvent(input: {
  title: string;
  description?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  location: string;
  image_url: string;
  isInviteOnly?: boolean;
  capacity?: number;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("events")
    .insert({
      title: input.title,
      description: input.description ?? null,
      date: input.date ?? null,
      start_time: input.start_time ?? null,
      end_time: input.end_time ?? null,
      location: input.location,
      image_url: input.image_url,
      is_invite_only: input.isInviteOnly ?? false,
      capacity: input.capacity ?? null,
      creator_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
}

export async function fetchAttendingEvents() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("event_participants")
    .select(
      `
      event:events!event_participants_event_uuid_fkey (
        uuid_id,
        title,
        image_url,
        date,
        start_time,
        end_time,
        location,
        is_invite_only,
        host:profiles!events_creator_id_fkey (
          id,
          username,
          avatar_url
        )
      )
    `,
    )
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return data
    .map((row) => {
      // row.event comes as an array from Supabase, get first item
      const event = Array.isArray(row.event) ? row.event[0] : row.event;
      if (!event) return null;

      // host also comes as array
      const host = Array.isArray(event.host) ? event.host[0] : event.host;

      return {
        ...event,
        host,
      };
    })
    .filter(
      (event) =>
        event && !isEventExpired(event.date, event.end_time, event.start_time),
    );
}

export async function fetchHostingEvents() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("events")
    .select(
      "uuid_id, title, image_url, date, start_time, end_time, location, is_invite_only",
    )
    .eq("creator_id", user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return data.filter(
    (event) => !isEventExpired(event.date, event.end_time, event.start_time),
  );
}

export async function fetchEventAttendees(eventUuid: string) {
  const { data, error } = await supabase
    .from("event_participants")
    .select(
      `
      user_id,
      created_at,
      profile:profiles!event_participants_user_id_fkey (
        id,
        username,
        avatar_url
      )
    `,
    )
    .eq("event_uuid", eventUuid);

  if (error || !data) {
    console.error("fetchEventAttendees error:", error);
    return [];
  }

  return data.map((row) => ({
    user_id: row.user_id,
    joined_at: row.created_at,
    profile: Array.isArray(row.profile) ? row.profile[0] : row.profile,
  }));
}

export async function removeEventParticipant(
  eventUuid: string,
  userId: string,
) {
  const { error } = await supabase
    .from("event_participants")
    .delete()
    .eq("event_uuid", eventUuid)
    .eq("user_id", userId);

  if (error) {
    console.error("removeEventParticipant error:", error);
    throw error;
  }
}

export async function fetchWaitlistUsers(eventUuid: string) {
  const { data: swipes, error: swipeError } = await supabase
    .from("event_swipes")
    .select(
      `
      user_id,
      profile:profiles!event_swipes_user_id_fkey (
        id,
        username,
        avatar_url,
        bio,
        tags
      )
    `,
    )
    .eq("event_uuid", eventUuid)
    .eq("decision", "like");

  if (swipeError) {
    console.error("fetchWaitlistUsers swipe error:", swipeError);
  }

  const { data: invites, error: inviteError } = await supabase
    .from("event_invites")
    .select(
      `
      user_id,
      profile:profiles!event_invites_user_id_fkey (
        id,
        username,
        avatar_url,
        bio,
        tags
      )
    `,
    )
    .eq("event_uuid", eventUuid)
    .eq("status", "pending");

  if (inviteError) {
    console.error("fetchWaitlistUsers invite error:", inviteError);
  }

  const combined = [...(swipes ?? []), ...(invites ?? [])].map((row) => ({
    user_id: row.user_id,
    profile: Array.isArray(row.profile) ? row.profile[0] : row.profile,
  }));

  const uniqueMap = new Map(
    combined.filter((row) => row.profile).map((row) => [row.user_id, row]),
  );

  return Array.from(uniqueMap.values());
}

export async function fetchHostDecisionMap(eventUuid: string) {
  const { data, error } = await supabase
    .from("host_event_decisions")
    .select("user_id, decision")
    .eq("event_uuid", eventUuid);

  if (error || !data) {
    console.error("fetchHostDecisionMap error:", error);
    return {};
  }

  return data.reduce<Record<string, "accepted" | "rejected">>((acc, row) => {
    acc[row.user_id] = row.decision;
    return acc;
  }, {});
}

export async function upsertHostDecision(
  eventUuid: string,
  userId: string,
  decision: "accepted" | "rejected",
) {
  const { error } = await supabase.from("host_event_decisions").upsert(
    {
      event_uuid: eventUuid,
      user_id: userId,
      decision,
    },
    { onConflict: "event_uuid,user_id" },
  );

  if (error) {
    console.error("upsertHostDecision error:", error);
    throw error;
  }
}

export async function addEventParticipant(eventUuid: string, userId: string) {
  const { error } = await supabase.from("event_participants").upsert(
    {
      event_uuid: eventUuid,
      user_id: userId,
    },
    { onConflict: "event_uuid,user_id" },
  );

  if (error) {
    console.error("addEventParticipant error:", error);
    throw error;
  }
}

export async function updateEvent(
  eventUuid: string,
  updates: {
    title?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    image_url?: string;
  },
) {
  const { error } = await supabase
    .from("events")
    .update({
      title: updates.title,
      date: updates.date,
      start_time: updates.start_time,
      end_time: updates.end_time,
      image_url: updates.image_url,
    })
    .eq("uuid_id", eventUuid);

  if (error) {
    console.error("updateEvent error:", error);
    throw error;
  }
}

export async function insertEventSwipe(
  eventUuid: string,
  decision: "like" | "nope",
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No active user");
    return;
  }

  const { error } = await supabase.from("event_swipes").insert({
    user_id: user.id,
    event_uuid: eventUuid,
    decision,
  });

  if (error) {
    console.error("insertEventSwipe error:", error);
    throw error;
  }
}
