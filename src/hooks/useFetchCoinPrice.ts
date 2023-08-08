import { useEffect, useState, useCallback } from 'react';

const useFetchCoinPrice = () => {
  const [coin, setCoin] = useState(null);
  const [coinPrice, setCoinPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const fetchCoinPrice = useCallback(async () => {
    if (!coin) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://public-api.birdeye.so/public/price?address=${coin}`,
      );
      const data = await response.json();
      if (data.success) {
        setCoinPrice(data.data);
      } else {
        setError('Failed to fetch coin price - Coin not found');
      }
    } catch (error) {
      setError('Failed to fetch coin price');
    } finally {
      setLoading(false);
    }
  }, [coin]);

  useEffect(() => {
    fetchCoinPrice();
  }, [fetchCoinPrice]);

  return { coinPrice, loading, error, fetchCoinPrice, setCoin };
};

export default useFetchCoinPrice;
