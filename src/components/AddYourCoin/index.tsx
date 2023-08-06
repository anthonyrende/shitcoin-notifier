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

export default function AddYourCoin({ isOpen, onOpen, onClose }) {
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
                // TODO: Add coin
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
