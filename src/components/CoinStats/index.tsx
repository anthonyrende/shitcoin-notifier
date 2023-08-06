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
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BsPerson } from 'react-icons/bs';
import { FiServer } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';

import useFetchCoinDetails from '@/hooks/useFetchCoinDetails';

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

export default function CoinStats(coins) {
  const { coinsWithPrices, loading, error } = useFetchCoinDetails(coins);
  console.log('coins withPrices: ', coinsWithPrices);
  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={'center'}
        fontSize={'4xl'}
        py={10}
        fontWeight={'bold'}
      >
        Coin Stats ({coins.coins.length})
      </chakra.h1>
      {coinsWithPrices.map((coin, index) => {
        return (
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 5, lg: 8 }}
            key={`${coins.coins.length}_${index}`}
          >
            <StatsCard
              title={'Name'}
              stat={coin.name}
              icon={<Img src={coin.logoURI} boxSize={'3em'} />}
            />
            <StatsCard
              title={'24h Price Change'}
              stat={coin.v24hChangePercent.toFixed(2) + '%'}
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
