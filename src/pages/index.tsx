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
import useFetchCoinPrice from '@/hooks/useFetchCoinPrice';

import coinDummyData from '../../coinDummyData.json';
import AddYourCoin from '@/components/AddYourCoin';

type Token = {
  tokenAccount: string;
  mint: string;
  amount: number;
  decimals: number;
};

const Home = () => {
  const [balance, setBalance] = useState<number>();
  const [coins, setCoins] = useState<Token[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { coinPrice, loading, error, fetchCoinPrice, setCoin } =
    useFetchCoinPrice();

  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        console.log(balance, wallet.publicKey.toBase58());
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  const getBalances = async () => {
    if (!publicKey) {
      return;
    }
    const url = `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=${process.env.NEXT_PUBLIC_HELIOUS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const getCoinsFromWallet = useCallback(async () => {
    if (!publicKey) {
      return;
    }
    getBalances()
      .then(async data => {
        const tokenAccount = data.tokens.map(async (token, index) => {
          if (token.amount > 2) {
            // Throttle requests by waiting 200ms before each one
            await sleep(200 * index);
            const response = await fetch(
              `https://public-api.birdeye.so/public/exists_token?address=${token.mint}`,
            );
            const resData = await response.json();

            if (resData?.data?.exists) {
              // First check if the token is already in the array
              const tokenIndex = coins.findIndex(
                coin => coin.mint === token.mint,
              );
              if (tokenIndex === -1) {
                // If not, add it to the array
                setCoins(prevCoins => {
                  return [...prevCoins, token];
                });
              }
            }
          }
        });
      })
      .catch(err => {
        console.log('error: ', err);
      });
  }, [publicKey]);

  useEffect(() => {
    // Uncomment to check get coins from wallet otherise use coinDummyData.json for testing
    getCoinsFromWallet();
    // setCoins(coinDummyData);
    // fetchCoinPrice();
  }, [getCoinsFromWallet]);

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
        <CoinStats coins={coins} pubkey={publicKey} />
      </>
    </MainLayout>
  );
};

export default Home;
