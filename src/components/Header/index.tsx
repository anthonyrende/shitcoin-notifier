import {
  Flex,
  Text,
  Button,
  VStack,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  LinkBox,
  LinkOverlay,
  Image,
  HStack,
  Stack,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { SigninMessage } from '@/utils/signInMessage';
import bs58 from 'bs58';
import { useEffect, useState } from 'react';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';

import { supabaseAuth } from '@/lib/supabaseAuth';

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      mod => mod.WalletMultiButton,
    ),
  { ssr: false },
);

export const Header: FC = () => {
  const router = useRouter();
  const { connected, publicKey, disconnect, wallet, signMessage } = useWallet();
  const walletModal = useWalletModal();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [localWalletState, setLocalWalletState] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      if (connected) {
        // walletModal.setVisible(true);
      }

      const csrf = await getCsrfToken();
      if (!wallet || !publicKey || !csrf || !signMessage) return;

      const message = new SigninMessage({
        domain: typeof window !== undefined ? window.location.host : '',
        publicKey: publicKey?.toBase58(),
        statement: `Sign to prove that you own this wallet`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(data);
      const serializedSignature = bs58.encode(signature);

      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (error) {
      console.error(error);
    }
  };
  // checkUserInDatabase();
  useEffect(() => {
    // Get the last used publicKey from local storage
    const lastPublicKey = localStorage.getItem('lastPublicKey');

    if (publicKey) {
      const currentPublicKey = publicKey?.toBase58();

      // Check if the user is unauthenticated or has changed their wallet
      if (status === 'unauthenticated' || lastPublicKey !== currentPublicKey) {
        handleSignIn();

        // Update the last used publicKey in local storage
        localStorage.setItem('lastPublicKey', currentPublicKey);
      }
    }
  }, [connected, status, session, wallet, publicKey?.toBase58()]);

  return (
    <Flex
      align="center"
      color="white"
      justify="space-between"
      position="fixed"
      px={6}
      py={4}
      top={0}
      w="100%"
      bg={'gray.800'}
    >
      <Text>Shitcoin Notifier </Text>
      <Text fontSize="sm">Notifications for when your shitcoin moons</Text>

      {!connected ? <WalletMultiButton /> : null}

      {connected && session?.user && (
        <Flex>
          <Menu>
            <Stack direction="row" spacing={4}>
              <MenuButton bg="purple.400" rounded={'md'} py="2" px="2">
                <Stack direction="row" spacing={2} align="center">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      boxSize="40px"
                      borderRadius="full"
                    />
                  )}
                  <Text>
                    {publicKey?.toString().slice(0, 6) +
                      '...' +
                      publicKey?.toString().slice(-4)}
                  </Text>
                </Stack>
              </MenuButton>
            </Stack>
            <MenuList>
              <MenuItem
                color="red.400"
                onClick={e => {
                  e.preventDefault();
                  signOut();
                  //   router.push('/api/auth/signout');
                }}
              >
                <FiLogOut />
                <Link href={`/api/auth/signout`} passHref>
                  <Text>Logout</Text>
                </Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
