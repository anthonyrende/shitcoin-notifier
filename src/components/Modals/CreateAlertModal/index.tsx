import React, { useState } from 'react';

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
} from '@chakra-ui/react';

const {
  SubscriptionManagerClient,
  TokenPriceStream,
  dataStreamFilters,
} = require('@hellomoon/api');

import WebSocketComponent from '@/components/WebSocketComponent';
import { getTokenPrice } from '@/utils/getTokenPriceRaydium';
import { FiDelete } from 'react-icons/fi';

const ConditionMenu = () => {
  const [conditions, setConditions] = useState([
    {
      operator: '=',
      value: '',
      type: '%',
    },
  ]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        operator: '=',
        value: '',
        type: '%',
      },
    ]);
  };

  const removeCondition = index => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  return (
    <div>
      {conditions.map((condition, index) => (
        <div key={index}>
          <HStack spacing={4} py="2">
            <Select
              value={condition.operator}
              onChange={e => updateCondition(index, 'operator', e.target.value)}
              size="lg"
              variant="filled"
              w="32"
            >
              <option value="=">=</option>
              <option value="!=">!=</option>
              <option value=">">&gt;</option>
            </Select>
            <Input
              value={condition.value}
              onChange={e => updateCondition(index, 'value', e.target.value)}
              placeholder="Enter Value"
              size="lg"
              variant="filled"
            />
            <Select
              value={condition.type}
              onChange={e => updateCondition(index, 'type', e.target.value)}
              placeholder="%"
              size="lg"
              variant="filled"
              w="32"
            >
              <option value="%">%</option>
              <option value="exact">Exact Price</option>
            </Select>
            <button onClick={() => removeCondition(index)}>
              <FiDelete />
            </button>
          </HStack>
        </div>
      ))}
      <Button
        mt={4}
        variant="solid"
        colorScheme="purple"
        onClick={() => addCondition()}
      >
        Or ...
      </Button>
    </div>
  );
};

export default function CreateAlertModal({ isOpen, onOpen, onClose }) {
  const [numOfConditions, setNumOfConditions] = useState(1);

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
            Create a new alert for your shitcoin
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color={'gray.700'}>Set condition </Text>
            <ConditionMenu />
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
                // createSubscription();
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
