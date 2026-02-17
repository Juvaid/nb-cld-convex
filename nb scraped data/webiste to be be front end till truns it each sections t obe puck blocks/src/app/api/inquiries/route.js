import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
        }

        const supabase = getSupabase();

        if (!supabase) {
            // Supabase not configured — log to console and return success
            console.log('Inquiry received (Supabase not configured):', { name, email, phone, message });
            return NextResponse.json({ success: true, fallback: true });
        }

        const { error } = await supabase
            .from('inquiries')
            .insert([{ name, email, phone, message }]);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: true, fallback: true });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
