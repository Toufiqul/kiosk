import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zcfdbmvxymhmjwrvednr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmRibXZ4eW1obWp3cnZlZG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MjYzNDIsImV4cCI6MjA1MTEwMjM0Mn0.olbqDeiVR8_lrIKQ9u_278kXRzcLGzB1BZqdBzeZNmg";
// const supabaseKey = import.meta.env.SUPA_BASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
