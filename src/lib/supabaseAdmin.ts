// src/lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

const URL        = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(URL, SERVICE_KEY);