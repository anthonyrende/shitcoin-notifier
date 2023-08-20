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
} from '@chakra-ui/react';

const {
  SubscriptionManagerClient,
  TokenPriceStream,
  dataStreamFilters,
} = require('@hellomoon/api');

import WebSocketComponent from '@/components/WebSocketComponent';
import { getTokenPrice } from '@/utils/getTokenPriceRaydium';
import { FiDelete } from 'react-icons/fi';
import { useConditionStore } from '@/stores/useConditionStore';

function describeCondition(operator, value, type) {
  let typeDescription = '';

  // Add specific descriptions based on the type
  switch (type) {
    case '%':
      typeDescription = `the current price by ${value}%`;
      break;
    case 'exact':
      typeDescription = `the exact price of ${value}`;
      break;
    default:
      typeDescription = `the current price`;
      break;
  }

  return `When the value is ${operator} ${typeDescription}`;
}

const ConditionMenu = ({ coin }) => {
  const { conditions, addCondition, removeCondition, updateCondition } =
    useConditionStore([
      'conditions',
      'addCondition',
      'removeCondition',
      'updateCondition',
    ]);

  const relevantCondition = conditions.find(
    condition => condition.mint === coin.mint,
  );
  const coinConditions = relevantCondition ? relevantCondition.conditions : [];

  const [conditionsState, setConditionsState] = useState(coinConditions);

  useEffect(() => {
    setConditionsState(coinConditions);
  }, [conditions]);
  console.log('conditionsState', relevantCondition);
  return (
    <div>
      {conditionsState.map((condition, index) => (
        <div key={index}>
          <HStack spacing={4} py="2">
            <Select
              value={condition.operator}
              onChange={e =>
                updateCondition(coin.mint, index, 'operator', e.target.value)
              }
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
              onChange={e =>
                updateCondition(coin.mint, index, 'value', e.target.value)
              }
              placeholder="Enter Value"
              size="lg"
              variant="filled"
            />
            <Select
              value={condition.type}
              onChange={e =>
                updateCondition(coin.mint, index, 'type', e.target.value)
              }
              placeholder="%"
              size="lg"
              variant="filled"
              w="32"
            >
              <option value="%">%</option>
              <option value="exact">Exact Price</option>
            </Select>
            <button onClick={() => removeCondition(coin.mint, index)}>
              <FiDelete />
            </button>
          </HStack>
        </div>
      ))}
      <Button
        mt={4}
        variant="solid"
        colorScheme="purple"
        onClick={() => addCondition(coin.mint)}
      >
        Or ...
      </Button>
      {conditionsState.map((condition, index) => (
        <Stack key={index} mt="4">
          <Text>
            {index === 0 ? '' : 'Or'}{' '}
            {describeCondition(
              condition.operator,
              condition.value,
              condition.type,
            )}
          </Text>
        </Stack>
      ))}
    </div>
  );
};

export default function CreateAlertModal({ isOpen, onOpen, onClose, coin }) {
  const { conditions } = useConditionStore(['conditions']);
  const [conditionsState, setConditionsState] = useState(conditions);
  useEffect(() => {
    setConditionsState(conditions);
  }, [conditions]);

  // console.log('conditions', conditionsState);

  // TODO: add condition to database

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
            <ConditionMenu coin={coin} />
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
                //  save to my database here api/createAlert
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
