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

const {
  SubscriptionManagerClient,
  TokenPriceStream,
  dataStreamFilters,
} = require('@hellomoon/api');

import WebSocketComponent from '@/components/WebSocketComponent';
import { getTokenPrice } from '@/utils/getTokenPriceRaydium';

export default function CreateAlertModal({ isOpen, onOpen, onClose }) {
  const subscriptionData = {
    mint: 'So11111111111111111111111111111111111111112',
    amount: 30,
    name: 'Alert when Wrapped Solana Drops Under 30 USDC',
  };

  // const createSubscription = () => {
  //   fetch('http://localhost:4000/api/createCoinSubscriptionWebSocket', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(subscriptionData),
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`Server responded with ${response.status}`);
  //       }
  //       return response.text();
  //     })
  //     .then(text => {
  //       try {
  //         return JSON.parse(text);
  //       } catch {
  //         throw new Error('Received non-JSON response:\n' + text);
  //       }
  //     })
  //     .then(data => {
  //       // Handle the parsed JSON data here...
  //     })
  //     .catch(error => {
  //       console.error('There was an error fetching the API:', error);
  //     });
  // };

  // const createSubscription = () => {
  //   const data = {
  //     mint: 'So11111111111111111111111111111111111111112',
  //     amount: 30,
  //     name: 'Alert when Wrapped Solana Drops Under 30 USDC',
  //   };

  //   fetch('/api/subscribeToTokenPrice', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //     .catch(error => console.error('Error:', error));
  // };
  const createSubscription = async () => {
    getTokenPrice('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
  };

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
            Create a new alert for your shitcoin
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Enter Address" size="lg" variant="filled" />
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
                createSubscription();
              }}
            >
              Create
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
