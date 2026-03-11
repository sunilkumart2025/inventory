import { createClient } from "@supabase/supabase-js/dist/index.cjs";

const supabaseUrl ="https://pnmazvgzcgbiudheqyqr.supabase.co";
const supabaseAnnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubWF6dmd6Y2diaXVkaGVxeXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjM4NDgsImV4cCI6MjA4ODc5OTg0OH0.ioPmIQrUmM6oWUChLD4G71b1YGVBZg2R3_7ou5BnsEc";

export const supabase = createClient(supabaseUrl, supabaseAnnonKey)                                                                                                                                                                                                                                                                                              