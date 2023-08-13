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
} from '@chakra-ui/react';
// import { Box } from "framer-motion"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsPencil, BsPencilSquare } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';

const WatchListTable = () => {
  const [coinstate, setCoinstate] = useState();
  const { coins, addToCoins, clearState, watchList, removeFromWatchList } =
    useCoinStore([
      'coins',
      'addToCoins',
      'clearState',
      'watchList',
      'removeFromWatchList',
    ]);
  useEffect(() => {
    setCoinstate(watchList);
  }, [watchList]);

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
            {coinstate?.map(coin => (
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
                  " test"
                </Td>
                <Td
                  fontSize={'sm'}
                  pb={2}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  whiteSpace={'nowrap'}
                  w={{ base: '24', md: '52' }}
                >
                  test
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
                        {coin ? (
                          <>
                            {/* <StarFilledIcon
                                color={'orange.300'}
                                h={4}
                                w={4}
                              /> */}
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
                              label="test"
                              hasArrow
                              arrowSize={10}
                              placement="top"
                              rounded={'md'}
                            >
                              <Button
                                variant={'outline'}
                                size={'sm'}
                                onClick={() => {
                                  // onConfirmationModalOpen();
                                }}
                                _hover={{
                                  color: 'orange.400',
                                }}
                                color="white"
                              >
                                default
                              </Button>
                            </Tooltip>
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
