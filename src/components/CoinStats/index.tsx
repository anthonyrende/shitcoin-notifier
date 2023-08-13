import { useEffect, useState, useCallback } from 'react';

import { Route } from 'next';
import { useRouter } from 'next/router';

import {
  Box,
  Button,
  chakra,
  Flex,
  Img,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BsPerson } from 'react-icons/bs';
import { FiServer } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';

import { useFetchCoinDetails } from '@/hooks/useFetchCoinDetails';
import useFetchCoinPrice from '@/hooks/useFetchCoinPrice';

import { fetchTokenStats } from '@/utils/fetchTokenStats';
import { formatAsPercentage } from '@/utils/formatAsPercentage';
import { useCoinStore } from '@/stores/useCoinStore';
import { Coin } from '@/types/types';
import useFromStore from '@/hooks/useFromStore';
import { fetchTokenMetadata } from '@/utils/fetchTokenMetaData';
import { useWallet } from '@solana/wallet-adapter-react';

interface StatsCardProps {
  title: string;
  stat: string | JSX.Element;
  icon: ReactNode;
}

function PriceDisplay({ price, decimals }) {
  const router = useRouter();
  if (!price || !Number.isFinite(price) || !Number.isFinite(decimals)) {
    return 'N/A';
  }

  // Convert the price to a string
  let priceString = price.toString();
  if (priceString.includes('.')) {
    // Remove the "0." prefix
    priceString = priceString.substring(2);
  }
  const zeros = '0'.repeat(decimals);
  // Calculate the full price with padding zeroes based on the number of decimals
  const fullPrice = `0.${zeros}${priceString}`;

  const shortPrice = `0.0...${fullPrice.slice(-6)}`;

  return (
    <Tooltip hasArrow label={`$${fullPrice}`} bg="purple.600">
      <span>{shortPrice}</span>
    </Tooltip>
  );
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

export default function CoinStats() {
  const router = useRouter();
  const { publicKey, disconnect, disconnecting } = useWallet();
  const [tokenStats, setTokenStats] = useState<any[]>([]);
  const [coinState, setCoinState] = useState<Coin[]>([]);
  const { coins, updateCoinMetaData, addToWatchList } = useCoinStore([
    'coins',
    'updateCoinMetaData',
    'addToWatchList',
  ]);

  useEffect(() => {
    if (coins && coins.length > 0) {
      setCoinState(coins);
    }
  }, [coins, disconnecting]);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCoinMetadata = useCallback(async () => {
    try {
      const coinsData = [];
      const metaData = [];
      for (let i = 0; i < coinState.length; i++) {
        await sleep(200 * i);
        const coin = coinState[i];
        const mintAddress = coin.mint;
        const metadata = await fetchTokenMetadata({ mintAddress });
        metaData.push(metadata);
        coinsData.push({ ...coin, metadata });
      }

      coinsData.forEach((coin, index) => {
        updateCoinMetaData(coin);
      });
    } catch (error) {
      console.error('Error fetching coin metadata:', error);
    }
  }, [coinState]);

  useEffect(() => {
    fetchCoinMetadata();
  }, [fetchCoinMetadata, coinState]);

  useEffect(() => {
    if (coinState && coinState.length > 0) {
      const fetchAllStats = async () => {
        try {
          const statsPromises = coinState.map(coin =>
            fetchTokenStats(coin.mint),
          );
          const allStats = await Promise.all(statsPromises);
          setTokenStats(allStats);
        } catch (error) {
          console.error('Error fetching token stats for all coins:', error);
        }
      };

      fetchAllStats();
    }
  }, [coinState]);

  // console.log('coinsPriceeeeeeee: ', coinPrices);
  console.log('coinState', coinState);

  // console.log('tokenStats: ', tokenStats);

  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={'center'}
        fontSize={'4xl'}
        py={10}
        fontWeight={'bold'}
      >
        Your Wallet Coins
      </chakra.h1>
      {coinState.length > 0 &&
        coinState &&
        coinState?.map((coin, index) => {
          return (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 5, lg: 8 }}
              key={`${coin.mint}_${index}`}
              // onClick={() => {
              //   router.push(`/coin/${coin.mint}`);
              // }}
            >
              <StatsCard
                title={'Name'}
                stat={coin?.metaData?.name}
                icon={<Img src={coin?.metaData?.image} boxSize={'3em'} />}
              />
              {/* <StatsCard
                title={'Current Price'}
                stat={
                  <PriceDisplay
                    price={coinPrices[index]?.priceData?.price}
                    decimals={coinPrices[index]?.decimals}
                  />
                }
                icon={<FiServer size={'3em'} />}
              /> */}
              <StatsCard
                title={'30 Min Price Change'}
                stat={
                  tokenStats[index] && tokenStats[index][5]
                    ? formatAsPercentage(tokenStats[index][5]?.priceChange)
                    : 'N/A'
                }
                icon={<BsPerson size={'3em'} />}
              />
              <StatsCard
                title={'Add to Watchlist'}
                stat={
                  <Button
                    onClick={() => addToWatchList(coin)}
                    colorScheme="purple"
                  >
                    Add
                  </Button>
                }
                icon={<GoLocation size={'3em'} />}
              />
            </SimpleGrid>
          );
        })}
    </Box>
  );
}
