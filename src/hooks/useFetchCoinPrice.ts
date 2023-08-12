import { useCoinStore } from '@/stores/useCoinStore';
import { useEffect, useState, useCallback } from 'react';

const useFetchCoinPrice = ({ coins } = {}) => {
  const [coinPrices, setCoinPrices] = useState([]);
  const [coinMints, setCoinMints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCoinPrices = useCoinStore(state => state.updateCoinPrices);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCoinPrice = useCallback(async () => {
    // if (!coins || coins.length === 0) {
    //   console.log('Coins array is empty or undefined');
    //   return;
    // }

    setLoading(true);
    setError(null);

    const coinsPriceData = [];
    // Filter out invalid entries and extract mints
    const newMints = coins
      .filter(coin => coin && typeof coin === 'object' && coin.mint)
      .map(coin => coin.mint);

    setCoinMints(prevState => [...prevState, ...newMints]);

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
        const mint = priceData.mint; // You might need to adjust this if the structure of priceData is different
        updateCoinPrices(mint, priceData);
      });

      coinsPriceData.push({ ...coins, priceData: data.data[0] });
    } catch (err) {
      console.error('Error fetching coin price for:', err);
      // You can decide whether to continue the loop or stop here
    }

    setCoinPrices(coinsPriceData);
    setLoading(false);
  }, [coins]);

  useEffect(() => {
    if (coins && coins.length > 0) {
      fetchCoinPrice();
    }
  }, [fetchCoinPrice, coins]);

  return { coinPrices, loading, error };
};

export default useFetchCoinPrice;
