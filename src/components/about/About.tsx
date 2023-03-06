import { Flex, Text, Link, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";

export default function About() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex cursor="pointer" onClick={onOpen}>?</Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>ByteSim - Website ecodesign tool 🌱</ModalHeader>
          <ModalBody>
            <Text fontSize={"md"}>
              ByteSim is a web application that simulates the ecological footprint of a website.
              From the import of a website mockup and the description of its content,
              ByteSim will create recommendations to reduce its ecological footprint.
            </Text>
            <Text marginTop={4} marginBottom={4} fontSize={"md"}>
              Project developed by the&nbsp;
              <Link href="https://heig-vd.ch/rad/instituts/mei" color="brand.500">Media Engineering Institute</Link>&nbsp;
              with the support of <Link href="https://www.romande-energie.ch/" color="brand.500">Romande Énergie</Link>.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
