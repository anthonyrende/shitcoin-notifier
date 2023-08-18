import { supabase } from '@/lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { coin, passedPublicKey: publicKey } = req.body;

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
    .single();

  console.log('existingWatchlist', existingWatchlist);

  if (fetchError) {
    return res.status(400).json({ error: 'Error fetching watchlist.' });
  }

  if (req.method === 'POST') {
    // If coin is already in watchlist, just return
    if (
      existingWatchlist &&
      existingWatchlist?.coins &&
      existingWatchlist?.coins?.mint?.includes(req.body.coin.mint)
    ) {
      return res.status(409).json({ error: 'Coin already in watchlist.' });
    }

    // Convert existingWatchlist.coins into an array, even if it's just a single coin object
    const existingCoinsMints = Array.isArray(existingWatchlist.coins)
      ? existingWatchlist.coins.map(coin => coin.mint)
      : [existingWatchlist.coins.mint];

    // Add the new coin to the array
    const newCoins = [...existingCoinsMints, req.body.coin.mint];

    // Update in the database as an array of objects
    const { error: updateError } = await supabase.from('watchlist').upsert({
      user_id: user.id,
      coins: newCoins.map(mint => ({ mint })),
    });

    console.log(
      'newCoins',
      newCoins,
      newCoins.map(mint => ({ mint })),
    );
    console.log('error', updateError);
    if (updateError) {
      return res.status(400).json({ error: 'Error updating watchlist.' });
    }

    return res.status(200).json({ message: 'Coin added to watchlist.' });
  }

  //   TODO: Implement DELETE method
  //   if (req.method === 'DELETE') {
  //     // If coin is not in watchlist, just return
  //     if (
  //       !existingWatchlist ||
  //       !existingWatchlist.coins.mint.includes(req.body.coin.mint)
  //     ) {
  //       return res.status(404).json({ error: 'Coin not found in watchlist.' });
  //     }

  //     // Remove the coin from the array
  //     const newCoins = existingWatchlist.coins.filter(
  //       coin => coin !== req.body.coin.mint,
  //     );

  //     const { error: updateError } = await supabase
  //       .from('watchlist')
  //       .update({
  //         coins: newCoins,
  //       })
  //       .eq('user_id', user.id);

  //     if (updateError) {
  //       return res.status(400).json({ error: 'Error updating watchlist.' });
  //     }

  //     return res.status(200).json({ message: 'Coin removed from watchlist.' });
  //   }
}

//   if (req.method !== 'POST') {
//     return res.status(405).end(); // Method Not Allowed
//   }

//   const { coin, passedPublicKey: publicKey } = req.body;

//   console.log('publicKey', publicKey);

//   if (!coin || !coin.mint) {
//     return res.status(400).json({ error: 'Coin data is missing.' });
//   }

//   // Find the user_id using the public_key
//   const { data: user, error: userError } = await supabase
//     .from('users')
//     .select('id')
//     .eq('public_key', publicKey)
//     .single();

//   if (userError || !user) {
//     return res.status(400).json({ error: 'User not found.' });
//   }

//   // Check if this coin is already in the user's watchlist
//   const { data: existingEntry, error: checkError } = await supabase
//     .from('watchlist')
//     .select('id')
//     .eq('user_id', user.id)
//     .eq('coin', coin.mint)
//     .single();

//   if (checkError) {
//     return res.status(400).json({ error: 'Error checking watchlist.' });
//   }

//   if (existingEntry) {
//     return res.status(409).json({ error: 'Coin already in watchlist.' });
//   }

//   // Now insert the coin into the watchlist with the user's id
//   const { data, error } = await supabase
//     .from('watchlist')
//     .insert([{ coins: coin.mint, user_id: user.id }]);

//   if (error) {
//     console.error('Watchlist insert error:', error);
//     return res
//       .status(500)
//       .json({ error: 'Failed to insert coin to watchlist.' });
//   }

//   return res.status(200).json(data);
// }
