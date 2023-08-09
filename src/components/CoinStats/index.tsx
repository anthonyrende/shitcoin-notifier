import { useEffect, useState } from 'react';

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
import { getTokenImage } from '@/utils/getTokenImage';

interface StatsCardProps {
  title: string;
  stat: string | JSX.Element;
  icon: ReactNode;
}

function PriceDisplay({ price, decimals }) {
  if (!price || !Number.isFinite(price) || !Number.isFinite(decimals)) {
    return 'N/A';
  }

  // Convert the price to a string
  let priceString = price.toString();
  if (priceString.includes('.')) {
    // Remove the "0." prefix
    priceString = priceString.substring(2);
  }
  console.log('priceString: ', priceString);

  const zeros = '0'.repeat(decimals);
  // Calculate the full price with padding zeroes based on the number of decimals
  const fullPrice = `0.${zeros}${priceString}`;
  console.log('fullPrice: ', fullPrice);
  const shortPrice = `0.0...${fullPrice.slice(-6)}`;
  console.log('shortPrice: ', shortPrice);
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

export default function CoinStats({ coins, pubkey }) {
  if (!coins) {
    return;
  }
  const { coinMetaData, loading, error } = useFetchCoinDetails({
    coins,
    pubkey,
  });

  const {
    coinPrices = [],
    loading: priceLoading,
    error: priceError,
  } = useFetchCoinPrice({ coins });

  console.log('coinsPriceeeeeeee: ', coinPrices);

  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={'center'}
        fontSize={'4xl'}
        py={10}
        fontWeight={'bold'}
      >
        Coin Stats ({coins?.length})
      </chakra.h1>
      {coinMetaData.length > 0 &&
        coinMetaData?.map((coin, index) => {
          return (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 5, lg: 8 }}
              key={`${coins}_${index}`}
            >
              <StatsCard
                title={'Name'}
                stat={
                  coin.metadata.legacyMetadata?.name ||
                  coin.metadata.onChainMetadata.metadata.data.name
                }
                icon={
                  <Img
                    src={
                      coin.metadata.offChainMetadata.metadata?.image ||
                      coin.metadata?.legacyMetadata?.logoURI
                    }
                    boxSize={'3em'}
                  />
                }
              />
              <StatsCard
                title={'Current Price'}
                stat={
                  <PriceDisplay
                    price={coinPrices[index]?.priceData?.price}
                    decimals={coinPrices[index]?.decimals}
                  />
                }
                icon={<FiServer size={'3em'} />}
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
