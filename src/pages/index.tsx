import { useEffect, useState, useCallback } from 'react';
import MainLayout from '@/Layout/Main.layout';
import {
  Button,
  Heading,
  Text,
  Icon,
  Link,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import CoinStats from '@/components/CoinStats';
import { FiGithub } from 'react-icons/fi';

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { useFetchCoinsFromWallet } from '@/hooks/useFetchCoinFromWallet';

import coinDummyData from '../../coinDummyData.json';
import AddYourCoin from '@/components/AddYourCoin';
import { useCoinStore } from '@/stores/useCoinStore';
import WatchListTable from '@/components/WatchlistTable';

type Token = {
  tokenAccount: string;
  mint: string;
  amount: number;
  decimals: number;
};

const Home = () => {
  const [coinstate, setCoinstate] = useState();
  const { coins, addToCoins, clearState } = useCoinStore([
    'coins',
    'addToCoins',
    'clearState',
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey, disconnect, disconnecting, connecting } = useWallet();
  const coinsFromWallet = useFetchCoinsFromWallet(
    publicKey,
    connection,
    TOKEN_PROGRAM_ID,
  );

  useEffect(() => {
    setCoinstate(coins);
  }, [coins]);

  useEffect(() => {
    if (coinsFromWallet && coinsFromWallet.length > 0) {
      console.log('coinsFromWallet here');
      coinsFromWallet.forEach(coin => {
        // Only add the coin if it's not already in the global state
        if (coinstate && !coinstate.some(c => c.mint === coin.mint)) {
          addToCoins(coin);
        }
      });
    }
  }, [coinsFromWallet, coins, addToCoins, publicKey, connection, connecting]);

  useEffect(() => {
    if (disconnecting) {
      console.log('disconnecting');
      disconnect();
      clearState();
    }
  }, [disconnect, clearState, disconnecting]);

  return (
    <MainLayout>
      <Heading size="4xl">
        Create notifications for your shitcoins, <br />
        you degenerate
      </Heading>
      <Text fontSize="lg" maxW="2xl" mt={4}>
        If a coin in your wallet is listed on BirdEye, you can create a
        notification for it. You will be notified when the price of the coin
        changes by more than 5% in the last 24 hours.
        <br />
        <br />
        {/* <b>Disclaimer:</b> This is a work in progress. Use at your own risk. */}
      </Text>
      <Link _hover={{ textDecor: 'none' }}>
        <Button
          _active={{
            bg: 'blackAlpha.800',
            transform: 'scale(0.95)',
          }}
          _hover={{ bg: 'blackAlpha.600' }}
          bg="blackAlpha.700"
          color="white"
          mt={4}
          rounded="full"
          shadow="lg"
          size="lg"
          onClick={onOpen}
        >
          <Icon as={FiGithub} mr={2} />
          Add your own coin
        </Button>
        <AddYourCoin isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      </Link>
      <>
        <WatchListTable />
        <CoinStats />
      </>
    </MainLayout>
  );
};

export default Home;
