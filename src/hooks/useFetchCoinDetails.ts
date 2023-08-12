import { useEffect, useState, useCallback } from 'react';
import { fetchTokenMetadata } from '@/utils/fetchTokenMetaData';
import { Coin } from '@/types/types';

import { isEqual } from 'lodash';

export const useFetchCoinDetails = ({ coins }: Coin[]) => {
  const [coinMetaData, setCoinMetaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (!coins || coins.length === 0) {
      console.log('Coins array is empty or undefined');
      return;
    }

    let isCancelled = false;

    const fetchCoinMetadata = async () => {
      setLoading(true);
      setError(null);

      const coinsData = [];
      for (let i = 0; i < coins.length; i++) {
        if (isCancelled) return;
        await sleep(200 * i);
        const coin = coins[i];
        const mintAddress = coin.mint;
        const metadata = await fetchTokenMetadata({
          mintAddress,
        });
        coinsData.push({ ...coin, metadata });
      }
      if (!isCancelled && !isEqual(coinsData, coinMetaData)) {
        setCoinMetaData(coinsData);
        setLoading(false);
      }
    };

    fetchCoinMetadata();

    return () => {
      isCancelled = true;
    };
  }, [coins, coinMetaData]);

  return { coinMetaData, loading, error };
};
export default useFetchCoinDetails;
