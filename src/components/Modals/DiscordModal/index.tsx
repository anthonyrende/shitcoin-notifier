import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Text,
  Flex,
  Input,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { on } from 'events';
import { useEffect, useState } from 'react';
import { BsDiscord, BsQuestion, BsQuestionCircle } from 'react-icons/bs';

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
export default function DiscordModal({ isOpen, onOpen, onClose }) {
  const [inputDiscordId, setInputDiscordId] = useState('');
  const [discordUserIdState, setDiscordUserIdState] = useState('');
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      // Using null to indicate uninitialized state
      getUserDiscordId(publicKey).then(res => {
        setDiscordUserIdState(res || '');
      });
    }
  }, [publicKey, discordUserIdState, loading, isOpen]);

  return (
    <>
      <Button
        bg="purple.400"
        rounded={'md'}
        mt="3"
        onClick={() => {
          onOpen();
        }}
      >
        <Stack direction="row" spacing={2} align="center">
          <BsDiscord size={'2em'} />
          <Text>Discord Notification</Text>
        </Stack>
      </Button>
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
          <ModalHeader color={'gray.700'} fontSize="xl" fontWeight="bold">
            <Flex position={'relative'}>
              <Text mr="2">Add Your Discord User ID</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {discordUserIdState && (
              <Text mb="5">
                You current discord id is: <b>{discordUserIdState}</b>
              </Text>
            )}
            <Flex flexDirection={'column'} w="full">
              <Text mb="2" fontSize={'sm'}>
                <Flex flexDirection={'row'} alignItems={'center'} mr="2">
                  Add your discord user id to recieve notification
                  <Tooltip
                    hasArrow
                    label="You can find your discord user id by going to your discord
                settings and enabling developer mode. Then right click on your
                profile and click copy id"
                    aria-label="A tooltip"
                    placement="top"
                    fontSize={'sm'}
                    rounded={'md'}
                  >
                    <span style={{ marginLeft: '5px', cursor: 'pointer' }}>
                      <BsQuestionCircle size={'1em'} />
                    </span>
                  </Tooltip>
                </Flex>
              </Text>

              <Input
                placeholder="Enter New Discord User ID"
                size="md"
                variant="filled"
                // clear the input after user clicks add
                value={inputDiscordId}
                onChange={e => {
                  setInputDiscordId(e.target.value);
                }}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex
              flexDirection={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              w="full"
            >
              <HStack spacing={4}>
                <Button
                  colorScheme={'purple'}
                  variant={'solid'}
                  loadingText="Adding"
                  isLoading={loading}
                  onClick={() => {
                    setLoading(true);
                    setUserDiscordId(publicKey, inputDiscordId).then(res => {
                      if (res) {
                        setLoading(false);
                      }
                    });
                  }}
                >
                  Add
                </Button>
                <Button onClick={onClose}>Close</Button>
              </HStack>
            </Flex>
            {/* TODO: Trigger discord DM onclick */}
            <Button variant={'solid'} colorScheme={'yellow'}>
              Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
