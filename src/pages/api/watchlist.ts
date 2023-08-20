import { supabase } from '@/lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { coin, publicKeyString: publicKey } = req.body;

  //   // Find the user_id using the public_key
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('public_key', publicKey)
    .single();

  if (userError || !user) {
    return res.status(400).json({ error: 'User not found.' });
  }

  // Fetch the existing watchlist for the user
  const { data: existingWatchlist, error: fetchError } = await supabase
    .from('watchlist')
    .select('coins')
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError) {
    return res.status(400).json({ error: 'Error fetching watchlist.' });
  }

  if (req.method === 'POST') {
    // If coin is already in watchlist, just return
    if (
      existingWatchlist &&
      existingWatchlist?.coins &&
      existingWatchlist.coins.find(coin => coin.mint === req.body.coin.mint)
    ) {
      return res.status(409).json({ error: 'Coin already in watchlist.' });
    }
    // Convert existingWatchlist.coins into an array, even if it's just a single coin object
    const existingCoinsMints = Array.isArray(existingWatchlist?.coins)
      ? existingWatchlist?.coins.map(coin => coin.mint)
      : [existingWatchlist?.coins.mint];

    // Add the new coin to the array if it exists, otherwise create a new array
    const newCoins = existingCoinsMints
      ? [...existingCoinsMints, req.body.coin.mint]
      : [req.body.coin.mint];

    // Update in the database as an array of objects
    const { error: updateError } = await supabase.from('watchlist').upsert({
      user_id: user.id,
      coins: newCoins.map(mint => ({ mint })),
    });

    if (updateError) {
      return res.status(400).json({ error: 'Error updating watchlist.' });
    }

    return res.status(200).json({ message: 'Coin added to watchlist.' });
  }

  if (req.method === 'DELETE') {
    // If coin is not in watchlist, just return
    if (
      !existingWatchlist ||
      !existingWatchlist.coins.find(coin => coin.mint === req.body.coin.mint)
    ) {
      return res.status(404).json({ error: 'Coin not found in watchlist.' });
    }

    // Remove the coin from the array
    const newCoins = existingWatchlist.coins.filter(
      coin => coin.mint !== req.body.coin.mint,
    );

    const { error: updateError } = await supabase
      .from('watchlist')
      .update({
        user_id: user.id,
        coins: newCoins,
      })
      .eq('user_id', user.id);

    if (updateError) {
      return res.status(400).json({ error: 'Error updating watchlist.' });
    }

    return res.status(200).json({ message: 'Coin removed from watchlist.' });
  }
}
