import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zcfdbmvxymhmjwrvednr.supabase.co";
const supabaseKey = import.meta.env.SUPA_BASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
