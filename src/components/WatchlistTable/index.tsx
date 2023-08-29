import { useCoinStore } from '@/stores/useCoinStore';
import { Coin } from '@/types/types';
import {
  Box,
  Stack,
  VStack,
  Flex,
  Divider,
  ButtonGroup,
  Tooltip,
  Button,
  HStack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useColorModeValue,
  Image,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
// import { Box } from "framer-motion"
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsPencil, BsPencilSquare } from 'react-icons/bs';
import { FiAlertCircle, FiDelete } from 'react-icons/fi';
import CreateAlertModal from '../Modals/CreateAlertModal';
import { PriceDisplay } from '../PriceDisplay';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConditionStore } from '@/stores/useConditionStore';

const getUserDiscordId = async (publicKey: PublicKey) => {
  const publicKeyString = publicKey?.toBase58();
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicKey: publicKeyString }),
  };
  const response = await fetch(`/api/discord/getDiscordId`, options);
  const data = await response.json();
  return data.user.discord_user_id;
};

const WatchListTable = () => {
  const [discordUserIdState, setDiscordUserIdState] = useState<string | null>(
    '',
  );
  const [watchListCoins, setWatchListCoins] = useState<Coin[]>();
  const [coinState, setCoinState] = useState<Coin[]>([]);
  const [conditionsState, setConditionsState] = useState<[]>([]);
  const { publicKey } = useWallet();
  const { conditions } = useConditionStore(['conditions']);

  const toast = useToast();
  useEffect(() => {
    setConditionsState(conditions);
  }, [conditions]);
  const { coins, addToCoins, clearState, watchList, removeFromWatchList } =
    useCoinStore([
      'coins',
      'addToCoins',
      'clearState',
      'watchList',
      'removeFromWatchList',
    ]);
  useEffect(() => {
    setWatchListCoins(watchList);
  }, [watchList]);

  useEffect(() => {
    setCoinState(coins);
  }, [coins]);

  const {
    isOpen: isCreateAlertOpen,
    onOpen: onCreateAlertOpen,
    onClose: onCreateAlertClose,
  } = useDisclosure();

  console.log('conditionsState', conditionsState);

  const currentCoinState = useCallback(
    coin => {
      return coinState?.find(c => c.mint === coin?.mint);
    },
    [coinState],
  );
  const [openedModalCoinMint, setOpenedModalCoinMint] = useState(null);
  const gray50 = useColorModeValue('gray.50', 'gray.700');
  const bg = useColorModeValue('purple.700', 'gray.800');
  const gray180 = useColorModeValue('gray.180', 'gray.700');
  const gray200 = useColorModeValue('gray.200', 'gray.600');
  const gray800 = useColorModeValue('gray.300', 'gray.500');

  useEffect(() => {
    if (publicKey) {
      // Using null to indicate uninitialized state
      getUserDiscordId(publicKey).then(res => {
        console.log('res', res);
        setDiscordUserIdState(res || ''); // Set to empty string if no ID is found
      });
    }
  }, [publicKey, setOpenedModalCoinMint]);
  const handleRemoveFromWatchList = async (
    coin: Coin,
    passedPublicKey: PublicKey,
  ) => {
    const publicKeyString = passedPublicKey.toBase58();
    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coin, publicKeyString }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Coin removed from watchlist:', data);
        removeFromWatchList(coin);
      } else {
        const { error } = await response.json();
        console.error('Failed to remove coin from watchlist:', error);
      }
    } catch (err) {
      console.error('Error while calling the API:', err);
    }
  };
  return (
    <Stack w="full" bg="purple.800" rounded={'lg'}>
      <TableContainer
        display={{
          base: 'none',
          lg: 'block',
        }}
        bg="purple.400"
        rounded={'lg'}
      >
        <Table
          variant="unstyled"
          style={{
            borderTop: '15px solid transparent',
            borderCollapse: 'collapse',
          }}
        >
          <Thead bg="purple.400">
            <Tr>
              <Th fontSize={'sm'} textTransform={'capitalize'} fontWeight={600}>
                Coin
              </Th>
              <Th fontSize={'sm'} textTransform={'capitalize'} fontWeight={600}>
                Price Alert %
              </Th>
              <Th fontSize={'sm'} textTransform={'capitalize'} fontWeight={600}>
                Current Price
              </Th>
            </Tr>
          </Thead>

          <Tbody id="tbody">
            {watchListCoins?.map((coin: Coin, index: number) => (
              <Tr
                key={coin.mint}
                bg={bg}
                borderRadius={'md'}
                boxShadow={'md'}
                borderBottomWidth="10px"
                borderBottomStyle="solid"
                // borderBottomColor={}
              >
                <Td fontSize={'sm'}>
                  <Flex alignItems="center" gap="1">
                    <Image
                      src={coin?.metaData?.image}
                      alt={coin?.metaData?.name}
                      w={9}
                      h={9}
                      mr={2}
                    />
                    {coin?.metaData?.name}
                  </Flex>
                </Td>
                <Td
                  fontSize={'sm'}
                  pb={2}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  whiteSpace={'nowrap'}
                  w={{ base: '24', md: '52' }}
                >
                  {coinState &&
                    currentCoinState(coin)?.statsData[0]?.priceChange}
                </Td>
                <Td
                  fontSize={'sm'}
                  pb={2}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  whiteSpace={'nowrap'}
                  w={{ base: '24', md: '52' }}
                >
                  {coinState && (
                    <PriceDisplay price={currentCoinState(coin)?.priceData} />
                  )}
                </Td>
                <Td>
                  <Flex justifyContent={'flex-end'} align={'center'}>
                    <ButtonGroup gap="2">
                      <Flex
                        alignItems="center"
                        gap="1"
                        justifyContent={'center'}
                        align={'center'}
                        margin={'auto'}
                      >
                        {/* TODO: Change this to currentConditionState(coin)?.conditions?.length > 0  */}
                        {coin?.watching ? (
                          <>
                            <FiAlertCircle size={20} />
                            <Text
                              fontSize="sm"
                              // color={'brand.500'}
                              // bg={'gradient.orange'}
                              //   style={{
                              //     WebkitBackgroundClip: 'text',
                              //     WebkitTextFillColor: 'transparent',
                              //   }}
                              color={'white'}
                            >
                              Watching
                            </Text>
                          </>
                        ) : (
                          <>
                            <Tooltip
                              label="Create new alert"
                              hasArrow
                              arrowSize={10}
                              placement="top"
                              rounded={'md'}
                            >
                              <Button
                                variant={'outline'}
                                size={'sm'}
                                onClick={() => {
                                  if (!publicKey) {
                                    toast({
                                      title: 'No wallet connected',
                                      description:
                                        'Please connect your wallet to create an alert',
                                      status: 'error',
                                      duration: 5000,
                                      isClosable: true,
                                    });
                                    return;
                                  }
                                  setOpenedModalCoinMint(coin.mint);
                                }}
                                _hover={{
                                  color: 'purple.400',
                                }}
                                color="white"
                              >
                                Create Price Alert
                              </Button>
                            </Tooltip>
                            {coin.mint === openedModalCoinMint && (
                              <CreateAlertModal
                                isOpen={!!openedModalCoinMint}
                                onClose={() => setOpenedModalCoinMint(null)}
                                onOpen={() => setOpenedModalCoinMint(coin.mint)}
                                coin={coin}
                                discordUserIdState={discordUserIdState}
                                setDiscordUserIdState={setDiscordUserIdState}
                              />
                            )}
                          </>
                        )}
                      </Flex>
                      {/* TODO: Add watching state */}
                      {coin?.watching && (
                        <Tooltip
                          label="test"
                          hasArrow
                          arrowSize={10}
                          placement="top"
                          rounded={'md'}
                        >
                          <Link href={coin?.watching}>
                            <a target="_blank">
                              <Button
                                bg={gray200}
                                borderRadius={'md'}
                                p="1"
                                color={gray800}
                                _hover={{
                                  bg: 'gray.300',
                                  color: 'orange.400',
                                }}
                              >
                                {/* Wacthing Icon here */}
                              </Button>
                            </a>
                          </Link>
                        </Tooltip>
                      )}
                      <Tooltip
                        label="Edit Coin Notification"
                        hasArrow
                        arrowSize={10}
                        placement="top"
                        rounded={'md'}
                      >
                        <Button
                          bg={gray200}
                          borderRadius={'md'}
                          p="1"
                          _hover={{
                            bg: 'gray.300',
                            color: 'orange.400',
                          }}
                          onClick={() => {
                            // TODO: Edit coin modal here
                          }}
                        >
                          <BsPencilSquare size={20} />

                          {/* TODO: Edit coin modal here */}
                        </Button>
                      </Tooltip>

                      <Tooltip
                        label="Remove Coin from Watchlist"
                        hasArrow
                        arrowSize={10}
                        placement="top"
                        rounded={'md'}
                      >
                        <Button
                          bg={gray200}
                          borderRadius={'md'}
                          p="1"
                          _hover={{
                            bg: 'gray.300',
                            color: 'orange.400',
                          }}
                          onClick={() => {
                            //TODO: Modal to confirm deletion
                            handleRemoveFromWatchList(coin, publicKey);
                          }}
                        >
                          <FiDelete size={20} />
                        </Button>
                      </Tooltip>
                      {/* TODO: Confirmation of deletion modal */}
                    </ButtonGroup>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default WatchListTable;
