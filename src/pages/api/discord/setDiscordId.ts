import { supabase } from '@/lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // .from('users')
  // .select('id')
  // .eq('public_key', publicKey)
  // .single();
  const { publicKey, discord_user_id } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('public_key', publicKey);

  console.log(data, error);
  const { data: user, error: userError } = await supabase
    .from('users')
    .update({
      discord_user_id: discord_user_id,
    })
    .eq('public_key', publicKey);

  console.log('user', user, userError, discord_user_id, publicKey);
  if (userError) {
    return res.status(400).json({ error: 'User not found.' });
  }

  if (req.method === 'POST') {
    return res
      .status(200)
      .json({ user, message: `Discord ID updated to ${discord_user_id}` });
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
