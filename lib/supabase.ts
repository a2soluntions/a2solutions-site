import { createClient } from '@supabase/supabase-js';

// Tenta pegar as chaves do ambiente
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// VACINA: Se as chaves não existirem (durante o build), usa valores falsos para não travar.
// Se existirem (no site real), usa as verdadeiras.
const supabaseUrl = (url && url.startsWith('http')) ? url : 'https://placeholder.supabase.co';
const supabaseKey = key || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);