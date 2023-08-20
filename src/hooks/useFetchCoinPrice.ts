import { useCoinStore } from '@/stores/useCoinStore';
import { useEffect, useState, useCallback, useRef } from 'react';

const useFetchCoinPrice = ({ coins } = {}) => {
  const [coinPrices, setCoinPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log('coins in price', coins);
  const prevCoinsLength = useRef<number>(coins.length); // Initialize the ref with the initial coins length

  const { updateCoinPrices, removeFromCoins } = useCoinStore([
    'updateCoinPrices',
    'removeFromCoins',
  ]);

  const fetchCoinPrice = useCallback(async () => {
    if (coins.length <= prevCoinsLength.current) {
      // No new coins have been added, so don't fetch metadata.
      return;
    }

    // Update the ref to the new coins length
    prevCoinsLength.current = coins.length;

    setLoading(true);
    setError(null);

    const coinsPriceData = [];

    // Filter out invalid entries and extract mints directly
    let coinMints =
      coins === typeof 'string'
        ? Array.from(coins)
        : coins
            .filter(coin => coin && typeof coin === 'object' && coin.mint)
            .map(coin => coin.mint);

    const url = 'https://rest-api.hellomoon.io/v0/token/price/batched';

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: process.env.NEXT_PUBLIC_HELLO_MOON_API_KEY,
      },
      body: JSON.stringify({ mints: coinMints }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      data.data.forEach(priceData => {
        const mint = priceData.mints;
        console.log('minttttt', priceData, 'MINT', mint);
        updateCoinPrices(mint, priceData);
      });

      coinsPriceData.push({ ...coins, priceData: data.data[0] });
    } catch (err) {
      console.error('Error fetching coin price for:', err);
    }

    setCoinPrices(coinsPriceData);
    setLoading(false);
  }, [coins]);

  useEffect(() => {
    fetchCoinPrice();
  }, [coinPrices, updateCoinPrices, coins, fetchCoinPrice]);

  return { coinPrices, loading, error };
};

export default useFetchCoinPrice;
