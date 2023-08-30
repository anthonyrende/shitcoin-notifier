import { supabase } from '@/lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getAlert(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { publicKey, mint } = req.query;

  // Find the user_id using the public_key
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('public_key', publicKey)
    .single();

  if (userError || !user) {
    return res.status(400).json({ error: 'User not found.' });
  }

  // Fetch the existing alerts for the user and mint
  const { data: existingAlert, error: fetchError } = await supabase
    .from('price_alert')
    .select('*')
    .eq('id', user.id)
    .eq('mint', mint)
    .maybeSingle();

  if (fetchError) {
    return res.status(400).json({ error: 'Error fetching alert.' });
  }

  if (existingAlert) {
    return res.status(200).json({ alert: existingAlert });
  } else {
    return res.status(200).json({ alert: null });
  }
}
