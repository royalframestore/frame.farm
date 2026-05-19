import { createClient } from '@supabase/supabase-js';

// This uses the SERVICE ROLE KEY — never import this in any client component
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy'
);
