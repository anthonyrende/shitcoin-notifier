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

const {
  SubscriptionManagerClient,
  TokenPriceStream,
  dataStreamFilters,
} = require('@hellomoon/api');

import WebSocketComponent from '@/components/WebSocketComponent';
import { FiDelete } from 'react-icons/fi';
import { useConditionStore } from '@/stores/useConditionStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useFetchCoinPrice from '@/hooks/useFetchCoinPrice';
import { useCoinStore } from '@/stores/useCoinStore';
import { formatPrice } from '@/utils/formatPrice';

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
        {conditions.length > 0 ? 'Or ...' : 'Add'}
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

const setUserDiscordId = async (
  publicKey: PublicKey,
  discordId: string,
): Promise<boolean> => {
  if (!publicKey) {
    return false;
  }
  const publicKeyString = publicKey ? publicKey?.toBase58() : '';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicKey: publicKeyString,
      discord_user_id: discordId,
    }),
  };
  const response = await fetch(`/api/discord/setDiscordId`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error || 'An error occurred while setting Discord ID.',
    );
  }
  return true;
};

type CreateAlertModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  coin: Coin;
  discordUserIdState: string | null;
  setDiscordUserIdState: (discordUserId: string) => void;
};

export default function CreateAlertModal({
  isOpen,
  onOpen,
  onClose,
  coin,
  discordUserIdState,
  setDiscordUserIdState,
}: CreateAlertModalProps) {
  const [inputDiscordId, setInputDiscordId] = useState('');
  const [discordInputLoading, setDiscordInputLoading] = useState(false);
  const { conditions } = useConditionStore(['conditions']);
  const { coins } = useCoinStore(['coins']);
  const [conditionsState, setConditionsState] = useState(conditions);
  const [coinState, setCoinState] = useState(coins);
  useEffect(() => {
    setConditionsState(conditions);
    setCoinState(coins);
  }, [conditions, coins]);

  const { publicKey } = useWallet();

  const toast = useToast();
  const alertConditions = conditionsState.find(
    condition => condition.mint === coin.mint,
  );

  const handleCreatePriceAlert = async (
    mint: string,
    conditions: any,
    passedPublicKey: PublicKey,
    coinPrice: number,
  ) => {
    const publicKeyString = passedPublicKey.toBase58();

    const requestBody = await {
      mint: mint,
      conditions: conditions,
      publicKeyString,
      price: coinPrice,
    };

    try {
      const response = await fetch('/api/priceAlerts/createOrUpdateAlert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        onClose();
        toast({
          title: `Alert created on ${coin.metaData.name}`,
          description: 'We’ve created your alert at price $' + coinPrice,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      } else {
        const { error } = await response.json();
        console.error('Failed to save to database:', error);
      }
    } catch (err) {
      console.error('Error while calling the API:', err);
    }
  };

  const handleAddButtonClick = async () => {
    setDiscordInputLoading(true);
    if (!publicKey) {
      return;
    }
    try {
      const success = await setUserDiscordId(publicKey, inputDiscordId);
      if (success) {
        setDiscordUserIdState(inputDiscordId); // Update the global state only here
        setDiscordInputLoading(false);
        toast({
          title: 'Discord ID set',
          description: 'We’ve set your Discord ID to ' + inputDiscordId,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error setting Discord ID:', error);
      setDiscordInputLoading(false);
    }
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
            {discordUserIdState && discordUserIdState.length > 1 ? (
              <>
                <Flex justifyContent={'space-between'}>
                  <Text color={'gray.700'}>Set condition </Text>
                  <Text color={'gray.700'}>
                    Current Price: ${formatPrice(coin.priceData)}{' '}
                  </Text>
                </Flex>
                <ConditionMenu coin={coin} />
              </>
            ) : (
              <DiscordIdModalBody
                discordId={inputDiscordId} // Pass the local state
                setDiscordId={setInputDiscordId} // Pass the local state updater
              />
            )}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <VStack
              spacing={4}
              // justifyContent={'center'}
              // alignContent={'center'}
              // alignItems={'center'}
              justifyItems={'space-around'}
              w="full"
            >
              <Flex flexDirection={'column'} w="50%"></Flex>
              <Flex>
                {discordUserIdState && discordUserIdState.length > 0 ? (
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
                      onClick={() => {
                        if (!publicKey) {
                          alert('Please connect your wallet');
                        }
                        alertConditions &&
                          publicKey &&
                          handleCreatePriceAlert(
                            alertConditions.mint,
                            alertConditions.conditions,
                            publicKey,
                            coin.priceData,
                          );
                      }}
                    >
                      Create
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={'solid'}
                    bgGradient={[
                      'linear(to-tr, teal.300, yellow.400)',
                      'linear(to-t, blue.200, teal.500)',
                      'linear(to-b, orange.100, purple.300)',
                    ]}
                    alignSelf={'center'}
                    onClick={() => {
                      handleAddButtonClick();
                    }}
                    loadingText="Adding"
                    isLoading={discordInputLoading}
                    _loading={{
                      bgGradient: [
                        'linear(to-tr, teal.300, yellow.400)',
                        'linear(to-t, blue.200, teal.500)',
                        'linear(to-b, orange.100, purple.300)',
                      ],
                    }}
                  >
                    Add
                  </Button>
                )}
                <Button colorScheme="purple" mr={3} onClick={onClose}>
                  Close
                </Button>
              </Flex>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

type DiscordIdModalBodyProps = {
  setDiscordId: (discordId: string) => void;
  discordId: string;
};

const DiscordIdModalBody = ({
  setDiscordId,
  discordId,
}: DiscordIdModalBodyProps) => {
  return (
    <Flex
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      w="full"
    >
      <Text mb="2" fontSize={'sm'}>
        Add your discord user id to recieve notification
      </Text>

      <Input
        placeholder="Enter Discord User ID"
        size="md"
        variant="filled"
        value={discordId}
        onChange={e => {
          setDiscordId(e.target.value);
        }}
      />
    </Flex>
  );
};
