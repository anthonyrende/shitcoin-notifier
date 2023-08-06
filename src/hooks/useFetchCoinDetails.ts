import { useEffect, useState, useCallback } from 'react';

const useFetchCoinsPrices = ({ coins }) => {
  const [coinsWithPrices, setCoinsWithPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  if (!coins) {
    return;
  }
  const fetchCoinsPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const coinsData = [];
      for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        await sleep(50 * i);
        const response = await fetch(
          //   `https://price.jup.ag/v4/price?ids=${coin.mint}`,
          'https://public-api.birdeye.so/public/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0',
        );
        const data = await response.json();
        // console.log('data', data);
        // coinsData.push({ ...coin, price: data[coin.mint].usd });
        // match mint address with tokens.addressi
        data.data.tokens.forEach((token, index) => {
          if (token.address === coin.mint) {
            coinsData.push({ ...token });
          }
        });
      }
      setCoinsWithPrices(coinsData);
    } catch (error) {
      setError('Failed to fetch coins prices');
    } finally {
      setLoading(false);
    }
  }, [coins, setCoinsWithPrices]);
  //   console.log('coins with prices', coinsWithPrices);
  useEffect(() => {
    if (coins && coins.length > 0) {
      fetchCoinsPrices();
    }
  }, [fetchCoinsPrices]);

  return { coinsWithPrices, loading, error };
};

export default useFetchCoinsPrices;
