import { getMintInfo } from '@/utils/getMintInfo';
import axios from 'axios';
import { useState, useEffect } from 'react';

const useFetchCoinsInfo = coins => {
  const [coinsInfo, setCoinsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoinInfo = async coins => {
    const url = 'https://rest-api.hellomoon.io/v0/token/creation';
    try {
      const { data } = await axios.post(
        url,
        {
          mint: coins.map(coin => coin.mint),
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: process.env.NEXT_PUBLIC_HELLO_MOON_API_KEY,
          },
        },
      );
      console.log('data', data);
      return data;
    } catch (e) {
      console.error('Error fetching coin info:', e);
      throw e;
    }
  };

  const fetchAllCoinsInfo = async () => {
    setLoading(true);
    try {
      const fetchedCoinsInfo = await Promise.all(
        coins.map(coin => fetchCoinInfo(coin.mint)),
      );
      setCoinsInfo(fetchedCoinsInfo);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCoinsInfo();
  }, [coins]);

  return { coinsInfo, loading, error };
};

export default useFetchCoinsInfo;
