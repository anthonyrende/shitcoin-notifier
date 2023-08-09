import { useEffect, useState, useCallback } from 'react';

const useFetchCoinPrice = ({ coins } = {}) => {
  const [coinPrices, setCoinPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCoinPrice = useCallback(async () => {
    if (!coins || coins.length === 0) {
      console.log('Coins array is empty or undefined');
      return;
    }

    setLoading(true);
    setError(null);

    const coinsPriceData = [];
    for (let i = 0; i < coins.length; i++) {
      await sleep(200 * i);
      const coin = coins[i];

      const url = 'https://rest-api.hellomoon.io/v0/token/price/batched';
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: process.env.NEXT_PUBLIC_HELLO_MOON_API_KEY,
        },
        body: JSON.stringify({ mints: [coin.mint] }),
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        coinsPriceData.push({ ...coin, priceData: data.data[0] });
      } catch (err) {
        console.error('Error fetching coin price for:', coin, err);
        // You can decide whether to continue the loop or stop here
      }
    }

    setCoinPrices(coinsPriceData);
    setLoading(false);
  }, [coins]);

  useEffect(() => {
    console.log('Initializing useFetchCoinPrice with coins:', coins);

    if (coins && coins.length > 0) {
      fetchCoinPrice();
    }
  }, [fetchCoinPrice, coins]);

  return { coinPrices, loading, error };
};

export default useFetchCoinPrice;
