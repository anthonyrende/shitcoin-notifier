import { useCoinStore } from '@/stores/useCoinStore';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetchCoinPrice = ({ coins } = {}) => {
  const [coinPrices, setCoinPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { updateCoinPrices } = useCoinStore(['updateCoinPrices']);

  const fetchTokenPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: tokenPrices } = await axios.get(
        'https://api.raydium.io/v2/main/price',
      );

      // Ensure coins is an array
      const coinMints = typeof coins === 'string' ? [coins] : coins;
      const coinsPriceData = coinMints
        .map(coin => {
          // Check if coin is an object and extract the mint property
          const mint = typeof coin === 'object' && coin.mint ? coin.mint : coin;

          const price = tokenPrices[mint];
          console.log(`Price for ${mint}: $${price}`);
          if (price) {
            updateCoinPrices(mint, price);
            return { mint, price };
          } else {
            console.warn(`Price not found for mint: ${mint}`);
            return null;
          }
        })
        .filter(Boolean); // Remove null entries
      setCoinPrices(coinsPriceData);
    } catch (err) {
      console.error('Error fetching token prices:', err);
      setError(err);
    }

    setLoading(false);
  }, [coins, updateCoinPrices]);

  useEffect(() => {
    fetchTokenPrices();
  }, [coins, fetchTokenPrices]);

  return { coinPrices, loading, error };
};

export default useFetchCoinPrice;
