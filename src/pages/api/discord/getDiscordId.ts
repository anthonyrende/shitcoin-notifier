import { supabase } from '@/lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { publicKey } = req.body;
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('discord_user_id')
    .eq('public_key', publicKey)
    .single();

  console.log('user', user);
  if (userError || !user) {
    return res.status(400).json({ error: 'User not found.' });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ user });
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
