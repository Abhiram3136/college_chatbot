import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users?.users?.[0]?.id || null;
  const { error: e3 } = await supabase.from('documents').insert({ title: 'T2', storage_path: 'T2', status: 'ready', uploaded_by: userId });
  console.log("ready without mime_type:", e3?.message);
}
test();
