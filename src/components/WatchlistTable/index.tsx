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
import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { BsDiscord, BsPencil, BsPencilSquare } from 'react-icons/bs';
import { FiAlertCircle, FiDelete } from 'react-icons/fi';
import CreateAlertModal from '../Modals/CreateAlertModal';
import { PriceDisplay } from '../PriceDisplay';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConditionStore } from '@/stores/useConditionStore';
import { publicKey } from '@raydium-io/raydium-sdk';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import { on } from 'events';
import { formatPrice } from '@/utils/formatPrice';
import { formatConiditionPrice } from '@/utils/formatConditionPrice';

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
  return data?.user?.discord_user_id;
};

const checkIfPriceAlertExists = async (
  pubkey: PublicKey,
  mint: string,
  setLoading: (arg0: boolean) => void,
) => {
  setLoading(true);
  const publicKeyString = pubkey?.toBase58();
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(
    `/api/priceAlerts/getAlert?publicKey=${publicKeyString}&mint=${mint}`,
    options,
  );
  const data = await response.json();
  setLoading(false);
  return data;
};

const WatchListTable = () => {
  const [discordUserIdState, setDiscordUserIdState] = useState<string | null>(
    '',
  );
  const [watchListCoins, setWatchListCoins] = useState<Coin[]>();
  const [coinState, setCoinState] = useState<Coin[]>([]);
  const [setCoinPrice, setSetCoinPrice] = useState<Record<string, any>>({});

  const [conditionsState, setConditionsState] = useState<[]>([]);
  const { publicKey } = useWallet();
  const { conditions } = useConditionStore(['conditions']);
  const [isWatching, setIsWatching] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
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

  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchAlerts = async () => {
      if (publicKey && watchListCoins) {
        const fetchPromises = watchListCoins.map(coin =>
          checkIfPriceAlertExists(publicKey, coin.mint, setLoading),
        );

        const results = await Promise.all(fetchPromises);

        const newIsWatching = {};
        const newSetCoinPrice = {};

        results.forEach((data, index) => {
          // console.log('data: ', data);
          const mint = watchListCoins[index].mint;
          newIsWatching[mint] =
            data?.alert?.set_coin_price !== null && data?.alert !== null;
          newSetCoinPrice[mint] = data?.alert?.set_coin_price;
        });

        // Update both state variables
        setIsWatching(newIsWatching);
        setSetCoinPrice(newSetCoinPrice);
      }
    };

    fetchAlerts();
  }, [publicKey, watchListCoins, isCreateAlertOpen]);

  const currentCoinState = useCallback(
    (coin: Coin) => {
      return coinState?.find(c => c.mint === coin?.mint);
    },
    [coinState],
  );
  const [openedModalCoinMint, setOpenedModalCoinMint] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const gray50 = useColorModeValue('gray.50', 'gray.700');
  const bg = useColorModeValue('purple.700', 'gray.800');
  const gray180 = useColorModeValue('gray.180', 'gray.700');
  const gray200 = useColorModeValue('gray.200', 'gray.600');
  const gray800 = useColorModeValue('gray.300', 'gray.500');

  useEffect(() => {
    if (publicKey) {
      // Using null to indicate uninitialized state
      getUserDiscordId(publicKey).then(res => {
        setDiscordUserIdState(res || ''); // Set to empty string if no ID is found
      });
    }
  }, [publicKey, isCreateAlertOpen]);

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
          <Thead bg="purple.400" w="full">
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
              <Th fontSize={'sm'} textTransform={'capitalize'} fontWeight={600}>
                Target Price
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
                  Not set
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
                <Td
                  fontSize={'sm'}
                  pb={2}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  whiteSpace={'nowrap'}
                  w={{ base: '24', md: '52' }}
                >
                  {setCoinPrice[coin.mint] ? (
                    <PriceDisplay
                      price={formatConiditionPrice(
                        setCoinPrice[coin.mint],
                        conditionsState.find((c: any) => c.mint === coin.mint)
                          ?.conditions,
                      )}
                    />
                  ) : (
                    'Not set'
                  )}
                </Td>
                <Td>
                  <Flex justifyContent={'flex-end'} align={'center'}>
                    {publicKey && (
                      <ButtonGroup gap="2">
                        <Flex
                          alignItems="center"
                          gap="1"
                          justifyContent={'center'}
                          align={'center'}
                          margin={'auto'}
                        >
                          {isWatching[coin.mint] ? (
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
                                Price Alert Is Set
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
                                    onCreateAlertOpen();
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
                                  isOpen={isCreateAlertOpen}
                                  onClose={() => onCreateAlertClose()}
                                  onOpen={() => onCreateAlertOpen()}
                                  coin={currentCoinState(coin)}
                                  discordUserIdState={discordUserIdState}
                                  setDiscordUserIdState={setDiscordUserIdState}
                                  loading={loading}
                                  setLoading={setLoading}
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
                        {isWatching[coin.mint] && (
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
                                setOpenedModalCoinMint(coin.mint);
                                onCreateAlertOpen();
                              }}
                            >
                              <BsPencilSquare size={20} />

                              {coin.mint === openedModalCoinMint && (
                                <CreateAlertModal
                                  isOpen={isCreateAlertOpen}
                                  onClose={() => onCreateAlertClose()}
                                  onOpen={() => onCreateAlertOpen()}
                                  coin={coin}
                                  discordUserIdState={discordUserIdState}
                                  setDiscordUserIdState={setDiscordUserIdState}
                                  loading={loading}
                                  setLoading={setLoading}
                                />
                              )}
                            </Button>
                          </Tooltip>
                        )}
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
                              setOpenedModalCoinMint(coin.mint);
                              setDeleteModal(true);
                            }}
                          >
                            <FiDelete size={20} />
                          </Button>
                        </Tooltip>
                        {coin.mint === openedModalCoinMint && (
                          <DeleteConfirmationModal
                            isOpen={!!deleteModal}
                            onClose={() => setDeleteModal(false)}
                            onOpen={() => onDeleteConfirmationOpen()}
                            setDeleteModal={setDeleteModal}
                            coin={coin}
                          />
                        )}
                      </ButtonGroup>
                    )}
                    {!publicKey && (
                      <Text fontSize={'sm'}>
                        {' '}
                        Connect your wallet to create an alert
                      </Text>
                    )}
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
