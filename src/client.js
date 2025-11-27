import { createClient } from '@supabase/supabase-js';

const URL = 'https://fmzvusvgpmwygpqlbict.supabase.co'
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtenZ1c3ZncG13eWdwcWxiaWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTUxNDUsImV4cCI6MjA3OTc3MTE0NX0.O9m-kFjQKflCabNA1px7WI41erYy9nCCLZcKoIgBzfA'

export const supabase = createClient(URL, API_KEY);
