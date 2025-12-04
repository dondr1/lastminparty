import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xleznweibpcayuaidonv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Rm4RnLIJf9RzV5O9mPVheQ_t0b4PzuK";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
