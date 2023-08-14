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
} from '@chakra-ui/react';
// import { Box } from "framer-motion"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsPencil, BsPencilSquare } from 'react-icons/bs';
import { FiAlertCircle, FiDelete } from 'react-icons/fi';
import CreateAlertModal from '../Modals/CreateAlertModal';
import { PriceDisplay } from '../PriceDisplay';

const WatchListTable = () => {
  const [watchListCoins, setWatchListCoins] = useState();
  const [coinState, setCoinState] = useState();
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

  const gray50 = useColorModeValue('gray.50', 'gray.700');
  const bg = useColorModeValue('purple.700', 'gray.800');
  const gray180 = useColorModeValue('gray.180', 'gray.700');
  const gray200 = useColorModeValue('gray.200', 'gray.600');
  const gray800 = useColorModeValue('gray.300', 'gray.500');
  return (
    <Stack w="full" bg="purple.800">
      <TableContainer
        display={{
          base: 'none',
          lg: 'block',
        }}
        bg="purple.400"
      >
        <Table
          variant="unstyled"
          //   bg={gray50}
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
            {watchListCoins?.map((coin, index) => (
              <Tr
                key={coin.mint}
                bg={bg}
                borderRadius={'md'}
                boxShadow={'md'}
                borderBottomWidth="10px"
                borderBottomStyle="solid"
                borderBottomColor={gray180}
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
                    {coin.metaData.name}
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
                    coinState.find(c => c.mint === coin.mint)?.statsData[0]
                      ?.priceChange}
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
                    <PriceDisplay
                      price={
                        coinState.find(c => c.mint === coin.mint)?.priceData
                          ?.price
                      }
                      decimals={
                        coinState.find(c => c.mint === coin.mint)?.statsData[0]
                          ?.decimals
                      }
                    />
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
                        {coin.watching ? (
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
                            <CreateAlertModal
                              isOpen={isCreateAlertOpen}
                              onClose={onCreateAlertClose}
                              onOpen={onCreateAlertOpen}
                            />
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
                            removeFromWatchList(coin);
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
