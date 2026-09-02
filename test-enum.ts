import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.rpc('get_schema_info', {}); // custom rpc? No.
  // Instead, let's just insert something with status = 'active' and see if it works.
  const { error: e1 } = await supabase.from('documents').insert({ title: 'T', storage_path: 'T', status: 'active', size_bytes: 0, mime_type: 'text/plain' });
  console.log("active:", e1?.message);
  
  const { error: e2 } = await supabase.from('documents').insert({ title: 'T', storage_path: 'T', status: 'ready', size_bytes: 0, mime_type: 'text/plain' });
  console.log("ready:", e2?.message);
}
test();
