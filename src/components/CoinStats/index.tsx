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
  Text,
  useToast,
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
import { PriceDisplay } from '../PriceDisplay';
import { PublicKey } from '@solana/web3.js';
import useFetchCoinInfo from '@/hooks/useFetchCoinInfo';
import { validateAndAddCoins } from '@/utils/validateCoins';

interface StatsCardProps {
  title: string;
  stat: string | JSX.Element;
  icon: ReactNode;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'3'}
      my="2"
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
      // w={'sm'}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 0 }}>
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
          justifySelf={'center'}
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

  const {
    coins,
    updateCoinMetaData,
    addToWatchList,
    removeFromCoins,
    updateTokenStats,
  } = useCoinStore([
    'coins',
    'updateCoinMetaData',
    'addToWatchList',
    'removeFromCoins',
    'updateTokenStats',
  ]);
  const toast = useToast();
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (coins && coins.length > 0) {
      setCoinState(coins);
    }
  }, [coins, disconnecting]);

  const fetchCoinMetadata = useCallback(async () => {
    const coinsData = [];
    const metaData = [];

    // Expected length should check if greater than 32 and less than 44 by regex
    const validMintAddressPattern = /^[a-zA-Z0-9]{32,44}$/;

    try {
      await Promise.all(
        coinState.map(async (coin, i) => {
          await sleep(200 * i);
          const mintAddress = coin.mint;

          // Check if mintAddress is valid. This is a basic check, adjust as necessary.
          if (
            !mintAddress ||
            typeof mintAddress !== 'string' ||
            !validMintAddressPattern.test(mintAddress)
          ) {
            console.error('Invalid mint address:', mintAddress);

            return;
          }

          try {
            const metadata = await fetchTokenMetadata({ mintAddress });
            metaData.push(metadata);
            coinsData.push({ ...coin, metadata });
          } catch (error) {
            console.error(
              'Error fetching metadata for mint address:',
              mintAddress,
              error,
            );
          }
        }),
      );
    } catch (error) {
      console.error('Error fetching coin metadata:', error);
    }

    coinsData.forEach((coin, index) => {
      updateCoinMetaData(coin);
    });
  }, [coinState]);

  useEffect(() => {
    fetchCoinMetadata();
  }, [fetchCoinMetadata]);

  useEffect(() => {
    if (coinState && coinState.length > 0) {
      const fetchAllStats = async () => {
        try {
          const statsPromises = coinState.map(coin =>
            fetchTokenStats(coin.mint),
          );
          const allStats = await Promise.all(statsPromises);
          allStats.forEach((stats, index) => {
            const mint = coinState[index].mint;

            updateTokenStats(mint, stats);
          });
          setTokenStats(allStats);
        } catch (error) {
          console.error('Error fetching token stats for all coins:', error);
        }
      };

      fetchAllStats();
    }
  }, [coinState]);

  const { coinPrices, loading, error } = useFetchCoinPrice({
    coins: coinState,
  });
  console.log('error: ', error);

  console.log('coinsPriceeeeeeee: ', coinPrices, coinState);
  // console.log('coinState', coinState);

  const handleAddToWatchList = async (
    coin: Coin,
    passedPublicKey: PublicKey,
  ) => {
    const publicKeyString = passedPublicKey.toBase58();

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coin, publicKeyString }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Coin added to watchlist:', data);
        addToWatchList(coin);
      } else {
        const { error } = await response.json();
        console.error('Failed to add coin to watchlist:', error);
        toast({
          title: 'Failed to add coin to watchlist',
          description: error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error while calling the API:', err);
    }
  };

  return (
    <Box maxW="78xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={'center'}
        fontSize={'4xl'}
        // py={20}
        pt="10"
        fontWeight={'bold'}
      >
        Your Wallet Coins
      </chakra.h1>
      <Text fontSize={'sm'} textAlign={'center'} pb="10">
        If you coin doesnt appear, it likely means there is no liquidity for it
      </Text>
      {coinState.length > 0 &&
        coinState &&
        coinState?.map((coin, index) => {
          return (
            coin.priceData && (
              <SimpleGrid
                columns={{ base: 1, md: 4 }}
                spacing={{ base: 5, lg: 4 }}
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
                <StatsCard
                  title={'Current Price'}
                  stat={<PriceDisplay price={coin?.priceData} />}
                  icon={<FiServer size={'3em'} />}
                />
                <StatsCard
                  title={'30 Min Price Change'}
                  stat={
                    tokenStats[index] && tokenStats[index][5]
                      ? formatAsPercentage(tokenStats[index][5]?.priceChange)
                      : 'N/A'
                  }
                  // icon={<BsPerson size={'3em'} />}
                />

                <Button
                  onClick={() => {
                    if (!publicKey) {
                      toast({
                        title: 'No wallet connected',
                        description:
                          'Please connect your wallet to add this coin to your watchlist',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                      });
                    } else {
                      handleAddToWatchList(coin, publicKey);
                    }
                  }}
                  colorScheme="purple"
                  mb={{ base: 7, md: 0 }}
                  w="200px"
                  justifySelf={'center'}
                  alignSelf={'center'}
                >
                  Add to Watchlist
                </Button>
              </SimpleGrid>
            )
          );
        })}
    </Box>
  );
}
