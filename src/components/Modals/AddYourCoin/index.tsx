import { useCoinStore } from '@/stores/useCoinStore';
import { Coin } from '@/types/types';
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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function AddYourCoin({ isOpen, onOpen, onClose }) {
  const [value, setValue] = useState('');
  const [coin, setCoin] = useState<Coin | null>(null);
  const { coins, addToCoins, addToWatchList } = useCoinStore([
    'coins',
    'addToCoins',
    'addToWatchList',
  ]);
  useEffect(() => {
    setCoin(coins);
  }, [coins]);
  // console.log('coin', coin);
  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          bgGradient={[
            'linear(to-tr, teal.300, yellow.400)',
            'linear(to-t, blue.200, teal.500)',
            'linear(to-b, orange.100, purple.300)',
          ]}
        >
          <ModalHeader color={'gray.700'}>
            Add Your Own Coin by Address
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter Address"
              size="lg"
              variant="filled"
              onChange={e => {
                setValue(e.target.value);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant={'solid'}
              bgGradient={[
                'linear(to-tr, teal.300, yellow.400)',
                'linear(to-t, blue.200, teal.500)',
                'linear(to-b, orange.100, purple.300)',
              ]}
              onClick={() => {
                // TODO: Add validation
                addToCoins({ mint: value });
                onClose();
              }}
            >
              Add Coin
            </Button>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
