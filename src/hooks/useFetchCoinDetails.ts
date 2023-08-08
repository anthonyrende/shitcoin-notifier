import { useEffect, useState, useCallback } from 'react';
import { fetchTokenMetadata } from '@/utils/fetchTokenMetaData';

const useFetchCoinDetails = ({ coins, connection, pubkey }) => {
  const [coinMetaData, setCoinMetaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCoinMetadata = useCallback(async () => {
    // console.log('here');
    if (!coins || coins.length === 0) {
      console.log('Coins array is empty or undefined');
      return;
    }
    // console.log('hrere2');
    setLoading(true);
    setError(null);

    const coinsData = [];
    for (let i = 0; i < coins.length; i++) {
      await sleep(200 * i);
      const coin = coins[i];
      const mintAddress = coin.mint;
      const metadata = await fetchTokenMetadata({
        mintAddress,
      });
      console.log('Fetched metadata', metadata);
      coinsData.push({ ...coin, metadata });
      //   } catch (error) {
      // console.error(`Failed to fetch metadata for coin ${coin.mint}`, error);
      //   }
    }
    setCoinMetaData(coinsData);
    setLoading(false);
  }, [coins, connection]);

  useEffect(() => {
    console.log('useEffect started with coins:', coins);
    if (coins && coins.length > 0) {
      fetchCoinMetadata();
    } else {
      console.log('useEffect skipped fetchCoinMetadata due to no coins');
    }
  }, [fetchCoinMetadata, coins]); // re-run whenever `coins` changes

  return { coinMetaData, loading, error };
};

export default useFetchCoinDetails;
