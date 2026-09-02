import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users?.users?.[0]?.id || null;
  console.log("User ID:", userId);

  const { error } = await supabase
    .from('documents')
    .insert({
      title: 'Test',
      storage_path: 'test',
      status: 'published',
      file_name: 'test',
      file_size: 0,
      file_type: 'test',
      uploaded_by: userId
    });
  
  console.log(error);
}
test();
