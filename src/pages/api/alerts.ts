import { supabase } from '@/lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { mint, conditions, publicKeyString: publicKey, price } = req.body;

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

  if (req.method === 'POST') {
    // If mint already has an alert for this user, update its conditions
    if (existingAlert) {
      const { error: updateError } = await supabase
        .from('price_alert')
        .update({
          conditions: conditions,
          set_coin_price: price,
          price_hit: true,
        })
        .eq('id', user.id)
        .eq('mint', mint);

      if (updateError) {
        return res.status(400).json({ error: 'Error updating alert.' });
      }

      return res.status(200).json({ message: 'Alert updated.' });
    } else {
      // Otherwise, create a new alert
      const { data: alertData, error: insertError } = await supabase
        .from('price_alert')
        .insert({
          id: user.id,
          mint: mint,
          conditions: conditions,
          set_coin_price: price,
          price_hit: true,
        });

      if (insertError) {
        return res.status(400).json({ error: 'Error creating alert.' });
      }

      return res.status(200).json({ message: 'Alert created.' });
    }
  }

  // TODO: Handle other HTTP methods (PUT, DELETE)
}
