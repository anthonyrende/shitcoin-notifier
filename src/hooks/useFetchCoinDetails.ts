import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchTokenMetadata } from '@/utils/fetchTokenMetaData';
import { Coin } from '@/types/types';

import { isEqual } from 'lodash';

export const useFetchCoinDetails = ({ coins }: Coin[]) => {
  const [coinMetaData, setCoinMetaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevCoinsLength = useRef(coins.length);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (!coins || coins.length === 0) {
      console.log('Coins array is empty or undefined');
      return;
    }
    console.log('coinslength', coins.length, prevCoinsLength.current);
    if (coins.length <= prevCoinsLength.current) {
      // No new coins have been added, so don't fetch metadata.
      return;
    }

    // Update the ref to the new coins length
    prevCoinsLength.current = coins.length;

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
      if (!isCancelled) {
        setCoinMetaData(prevMetaData => {
          if (isEqual(prevMetaData, coinsData)) {
            return prevMetaData;
          }
          return coinsData;
        });
        setLoading(false);
      }
    };

    fetchCoinMetadata();

    return () => {
      isCancelled = true;
    };
  }, [coins]);

  return { coinMetaData, loading, error };
};
