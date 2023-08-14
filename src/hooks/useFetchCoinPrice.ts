import { useCoinStore } from '@/stores/useCoinStore';
import { useEffect, useState, useCallback, useRef } from 'react';

const useFetchCoinPrice = ({ coins } = {}) => {
  const [coinPrices, setCoinPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevCoinsLength = useRef<number>(coins.length); // Initialize the ref with the initial coins length

  const { updateCoinPrices } = useCoinStore(['updateCoinPrices']);

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
    const coinMints = coins
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
        const mint = priceData.mint;
        updateCoinPrices(mint, priceData);
      });

      coinsPriceData.push({ ...coins, priceData: data.data[0] });
    } catch (err) {
      console.error('Error fetching coin price for:', err);
    }

    setCoinPrices(coinsPriceData);
    setLoading(false);
  }, [coins, updateCoinPrices]);

  useEffect(() => {
    if (!coinPrices || !Array.isArray(coinPrices)) return;

    // Iterate over the coinPrices array and update each coin's price in the store
    coinPrices.forEach(coinPriceData => {
      if (coinPriceData.priceData && coinPriceData.priceData.mints) {
        updateCoinPrices(
          coinPriceData.priceData.mints,
          coinPriceData.priceData,
        );
      }
    });
  }, [coinPrices, updateCoinPrices]);

  return { coinPrices, loading, error };
};

export default useFetchCoinPrice;
