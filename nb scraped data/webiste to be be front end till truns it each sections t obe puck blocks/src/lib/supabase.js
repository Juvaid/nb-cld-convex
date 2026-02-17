import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy-initialize Supabase client — avoids build-time errors when env vars are not set
let _supabase = null;

export function getSupabase() {
    if (_supabase) return _supabase;
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
        return null;
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
    return _supabase;
}

// For backwards compatibility
export const supabase = null; // Use getSupabase() instead
