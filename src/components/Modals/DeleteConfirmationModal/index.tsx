import { Coin } from '@/types/types';
import React, { useEffect, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Select,
  HStack,
  Text,
  Stack,
  Flex,
  useToast,
  Divider,
  VStack,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCoinStore } from '@/stores/useCoinStore';
import { PublicKey } from '@solana/web3.js';
type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  coin: Coin;
  setDeleteModal(arg0: boolean): void;
};

const DeleteConfirmationModal = ({
  isOpen,
  onOpen,
  onClose,
  coin,
  setDeleteModal,
}: DeleteConfirmationModalProps) => {
  const toast = useToast();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const { removeFromWatchList } = useCoinStore(['removeFromWatchList']);

  const handleRemoveFromWatchList = async (
    coin: Coin,
    passedPublicKey: PublicKey,
  ) => {
    const publicKeyString = passedPublicKey.toBase58();
    setLoading(true);
    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coin, publicKeyString }),
      });

      if (response.ok) {
        removeFromWatchList(coin);

        toast({
          title: 'Coin removed from watchlist',
          description: `${coin?.metaData?.name} has been removed from your watchlist`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      } else {
        const { error } = await response.json();
        console.error('Failed to remove coin from watchlist:', error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error while calling the API:', err);
    }
  };

  return (
    <>
      <Modal
        isCentered
        onClose={() => {
          setDeleteModal(false);
        }}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent
          bgGradient={[
            'linear(to-tr, teal.300, yellow.400)',
            'linear(to-t, blue.200, teal.500)',
            'linear(to-b, orange.100, purple.300)',
          ]}
        >
          <ModalHeader color={'gray.700'} fontSize="xl" fontWeight="bold">
            Remove {coin?.metaData?.name} from your watchlist?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="md">
              Are you sure you want to remove {coin?.metaData?.name} from your
              watchlist? This will reset your price alert
            </Text>
          </ModalBody>

          <ModalFooter>
            <HStack
              spacing={4}
              justifyContent={'center'}
              alignContent={'center'}
              alignItems={'center'}
              justifyItems={'space-between'}
              w="full"
            >
              <>
                <Button
                  variant={'solid'}
                  bgGradient={[
                    'linear(to-tr, teal.300, yellow.400)',
                    'linear(to-t, blue.200, teal.500)',
                    'linear(to-b, orange.100, purple.300)',
                  ]}
                  alignSelf={'center'}
                  justifyContent={'center'}
                  justifySelf={'center'}
                  loadingText="Removing"
                  isLoading={loading}
                  onClick={() => {
                    if (!publicKey) {
                      alert('Please connect your wallet');
                    } else {
                      handleRemoveFromWatchList(coin, publicKey);
                    }
                  }}
                >
                  Remove
                </Button>
              </>

              <Button colorScheme="purple" mr={3} onClick={onClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
