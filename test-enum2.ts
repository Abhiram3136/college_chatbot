import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users?.users?.[0]?.id || null;

  const { error: e1 } = await supabase.from('documents').insert({ title: 'T', storage_path: 'T', status: 'published', size_bytes: 0, mime_type: 'text/plain', uploaded_by: userId });
  console.log("published:", e1?.message);
  
  const { error: e2 } = await supabase.from('documents').insert({ title: 'T', storage_path: 'T', status: 'ready', size_bytes: 0, mime_type: 'text/plain', uploaded_by: userId });
  console.log("ready:", e2?.message);
}
test();
