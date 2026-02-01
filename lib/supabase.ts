import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificação de segurança: Só cria o cliente se as chaves existirem
// Se não existirem (durante o build), cria um cliente 'falso' ou null para não travar
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key'); 

// Nota: O 'placeholder' evita o erro "Invalid URL" durante o build, 
// mas o site real precisa das variáveis corretas no Netlify para funcionar.