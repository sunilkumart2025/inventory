import { createClient } from "@supabase/supabase-js/dist/index.cjs";

const supabaseUrl ="https://bshudxnslepyfbcjhqcl.supabase.co";
const supabaseAnnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaHVkeG5zbGVweWZiY2pocWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTUwNjUsImV4cCI6MjA4ODM3MTA2NX0.GNMhayAWwyBDPlep8-Q_O640pzbMMcEfAp62L1-cjK0";

export const supabase = createClient(supabaseUrl, supabaseAnnonKey)                                                                                                                                                                                                                                                                                              