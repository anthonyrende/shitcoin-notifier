import { SupabaseAdapter } from '@auth/supabase-adapter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// const options = {
//   db: { schema: 'next_auth' },
// };
export const supabaseAuth = SupabaseAdapter({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
