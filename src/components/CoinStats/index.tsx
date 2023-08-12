import { useEffect, useState } from 'react';

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

import useFetchCoinDetails from '@/hooks/useFetchCoinDetails';
import useFetchCoinPrice from '@/hooks/useFetchCoinPrice';

import { fetchTokenStats } from '@/utils/fetchTokenStats';
import { formatAsPercentage } from '@/utils/formatAsPercentage';
import { useCoinStore } from '@/stores/useCoinStore';
import { Coin } from '@/types/types';
import useFromStore from '@/hooks/useFromStore';

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
  const [tokenStats, setTokenStats] = useState<any[]>([]);
  const [coinState, setCoinState] = useState<Coin[]>([]);
  const coins = useFromStore(useCoinStore, state => state.coins);

  const updateCoinMetaDataAction = useCoinStore(
    state => state.updateCoinMetaData,
  );
  const updateCoinPricesAction = useCoinStore(state => state.updateCoinPrices);

  useEffect(() => {
    setCoinState(coins as Coin[]);
  }, [coins]);

  const { coinMetaData, loading, error } = useFetchCoinDetails({
    coins,
  });

  useEffect(() => {
    if (coinMetaData) {
      updateCoinMetaDataAction(coins, coinMetaData);
    }
  }, [coinMetaData]);

  useEffect(() => {
    if (coins && coins.length > 0) {
      const fetchAllStats = async () => {
        try {
          const statsPromises = coins.map(coin => fetchTokenStats(coin.mint));
          const allStats = await Promise.all(statsPromises);
          setTokenStats(allStats);
        } catch (error) {
          console.error('Error fetching token stats for all coins:', error);
        }
      };

      fetchAllStats();
    }
  }, [coins]);

  // console.log('coinsPriceeeeeeee: ', coinPrices);
  console.log('coins', coinMetaData);

  // console.log('tokenStats: ', tokenStats);

  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={'center'}
        fontSize={'4xl'}
        py={10}
        fontWeight={'bold'}
      >
        Your Coin Stats ({coins?.length})
      </chakra.h1>
      {coinMetaData.length > 0 &&
        coinMetaData?.map((coin, index) => {
          return (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 5, lg: 8 }}
              key={`${coins}_${index}`}
              // onClick={() => {
              //   router.push(`/coin/${coin.mint}`);
              // }}
            >
              <StatsCard
                title={'Name'}
                stat={
                  coin.metadata?.legacyMetadata?.name ||
                  coin.metadata?.onChainMetadata?.metadata?.data?.name
                }
                icon={
                  <Img
                    src={
                      coin.metadata?.offChainMetadata?.metadata?.image ||
                      coin.metadata?.legacyMetadata?.logoURI
                    }
                    boxSize={'3em'}
                  />
                }
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
                title={'Create Notification'}
                stat={<Button colorScheme="purple">Create</Button>}
                icon={<GoLocation size={'3em'} />}
              />
            </SimpleGrid>
          );
        })}
    </Box>
  );
}
