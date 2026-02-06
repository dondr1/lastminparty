import { supabase } from "../../supabaseClient";

// Simple in-memory cache - export it so it can be used elsewhere
export const profileCache = new Map<
  string,
  { exists: boolean; timestamp: number }
>();
const CACHE_DURATION = 30000; // 30 seconds

export async function checkHasProfile(userId: string): Promise<boolean> {
  console.log("🔍 checkHasProfile called for:", userId);

  // Check cache first
  const cached = profileCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("✨ Using cached result:", cached.exists);
    return cached.exists;
  }

  try {
    console.log("🌐 Querying Supabase for profile...");
    const startTime = Date.now();

    // Add a timeout wrapper
    const queryPromise = supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout after 3 seconds")), 3000);
    });

    const result = (await Promise.race([queryPromise, timeoutPromise])) as any;
    const { data, error, status } = result;

    const duration = Date.now() - startTime;
    console.log(`⏱️ Query completed in ${duration}ms`);
    console.log("📦 Response:", { data, error, status });

    if (error) {
      console.error("❌ Supabase error:", error);
      console.error("   Error details:", JSON.stringify(error));
      return false;
    }

    const exists = !!data;
    console.log("📊 Profile exists:", exists);

    // Cache the result
    profileCache.set(userId, { exists, timestamp: Date.now() });
    return exists;
  } catch (error: any) {
    console.error("❌ Exception in checkHasProfile:", error?.message || error);
    console.error("   Full error:", error);
    return false;
  }
}

// Clear cache when profile is created
export function clearProfileCache(userId: string) {
  console.log("🗑️ Clearing profile cache for:", userId);
  profileCache.delete(userId);
}

export async function upsertProfile(input: {
  username: string;
  avatar_url: string;
  bio_image_url?: string;
  bio?: string;
  tags?: string[];
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username: input.username,
    avatar_url: input.avatar_url,
    bio_image_url: input.bio_image_url ?? null,
    bio: input.bio ?? null,
    tags: input.tags ?? null,
  });

  if (error) throw error;

  // Clear cache after successful upsert
  clearProfileCache(user.id);
}
