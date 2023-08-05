
import { useEffect, useState, useCallback } from 'react';  
import MainLayout from '@/Layout/Main.layout';
import { Button, Heading, Text, Icon, Link } from '@chakra-ui/react';
import CoinStats from '@/components/CoinStats';
import { FiGithub } from 'react-icons/fi';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useFetchCoinsFromWallet } from '@/hooks/useFetchCoinFromWallet';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { get } from 'http';
import useFetchCoinPrice from '@/hooks/useFetchCoinPrice';

type Token = {
  tokenAccount: string;
  mint: string;
  amount: number;
  decimals: number;
};

const Home = () => {
  const [balance, setBalance] = useState<number>();
  const [coins, setCoins] = useState<Token[]>([]);

  const { coinPrice, loading, error, fetchCoinPrice, setCoin } = useFetchCoinPrice();
  
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const {publicKey} = useWallet();

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        console.log(balance, wallet.publicKey.toBase58());
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  
  // const coins = useFetchCoinsFromWallet(publicKey, connection, TOKEN_PROGRAM_ID);
  
  // console.log(coins);

  const url = `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=${process.env.NEXT_PUBLIC_HELIOUS_API_KEY}}`;

  const getBalances = async () => {
    if (!publicKey) {
      return;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const getCoinsFromWallet = useCallback(async () => {
    if (!publicKey) {
      return;
    }
    getBalances().then(async (data) => {
      const tokenAccount = data.tokens.map(async(token, index) => {
        if (token.amount > 2) {
          // Throttle requests by waiting 200ms before each one
          await sleep(100 * index);
          const response = await fetch(`https://public-api.birdeye.so/public/exists_token?address=${token.mint}`);
          const resData = await response.json();
          if (resData.data.exists) {
            // First check if the token is already in the array
            const tokenIndex = coins.findIndex((coin) => coin.mint === token.mint);
            if (tokenIndex === -1) {
              // If not, add it to the array
              setCoins((prevCoins) => {
                return [...prevCoins, token];
              });
            }
          }
        }
      });
    }).catch((err) => {
      console.log("error: ", err);
    });
  }, [publicKey]);

  useEffect(() => {
    // Uncomment to check if token exists on mount
    // getCoinsFromWallet1();
    fetchCoinPrice();
  }, [getCoinsFromWallet]);

console.log("coins: ", coins)

  return (
    <MainLayout>
      <Heading size="4xl">
        Create your Next Solana Project <br />
        in seconds.
      </Heading>
      <Text fontSize="lg" maxW="2xl" mt={4}>
        An opinionated Next.js template for building Solana applications pre
        configured with Chakra UI, Next.js, Solana wallet adapter, ESlint,
        Prettier, and more.
      </Text>
      <p>{balance}</p>
      <Link
        _hover={{ textDecor: 'none' }}
        href="https://github.com/avneesh0612/next-solana-starter"
        isExternal
      >
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
        >
          <Icon as={FiGithub} mr={2} />
          Star on GitHub
        </Button>
      </Link>
      <CoinStats />
    </MainLayout>
  );
};

export default Home;
