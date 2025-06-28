import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session);
    if (session && session.user) {
        if (event === 'SIGNED_IN') {
            const { data, error } = await supabase
                .from('Profiles')
                .select('id')
                .eq('id', session.user.id);
            if (error) {
                console.error('Error checking profile:', error);
            } else if (data.length === 0) {
                const { error: insertError } = await supabase
                    .from('Profiles')
                    .insert([{ id: session.user.id }]);
                if (insertError) {
                    console.error('Error creating profile:', insertError);
                }
            }
        }
    }
});