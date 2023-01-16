import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Center,
	Image,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';

const TradeDialog = ({ reference, isOpen, onClose, card, username }) => {
	return (
		<>
			<AlertDialog
				motionPreset="slideInBottom"
				leastDestructiveRef={reference}
				onClose={onClose}
				isOpen={isOpen}
				isCentered>
				<AlertDialogOverlay />

				<AlertDialogContent bgColor="#1D1D1D" border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
					<AlertDialogHeader textAlign="center" color="white">
						<Center>
							<Text>TRADE CARD</Text>
						</Center>
					</AlertDialogHeader>
					<AlertDialogCloseButton />
					<AlertDialogBody>
						<Center rounded="lg" bgColor="whiteAlpha.100" p={4}>
							<Stack direction="row" align="center" spacing={4}>
								<Image src={card.cardImgUrl} maxH="5rem" />
								<Box>
									<Text fontSize="2xl" fontWeight="bold" color="white">
										{card.name}
									</Text>
									<Text fontSize="sm" color="gray.500">
										{card.channel} / {card.rarity}
									</Text>
									<Text fontSize="sm" color="gray.500">
										Quantity: {card.quantityQNT}
									</Text>
								</Box>
							</Stack>
						</Center>

						<SimpleGrid columns={2} my={4} shadow="lg">
							<Box
								color="white"
								bgColor="whiteAlpha.100"
								p={4}
								borderLeftRadius="lg"
								textAlign="center"
								fontSize="xl"
								_hover={{ bgColor: 'whiteAlpha.300', cursor: 'pointer' }}
								borderRight="0px"
								borderBottom="1px"
								borderLeft="1px"
								borderTop="1px"
								borderColor="whiteAlpha.300">
								ASK
							</Box>
							<Box
								color="white"
								bgColor="whiteAlpha.100"
								p={4}
								borderRightRadius="lg"
								textAlign="center"
								fontSize="xl"
								_hover={{ bgColor: 'whiteAlpha.300', cursor: 'pointer' }}
								borderRight="1px"
								borderBottom="1px"
								borderLeft="0px"
								borderTop="1px"
								borderColor="whiteAlpha.300">
								BID
							</Box>
						</SimpleGrid>
					</AlertDialogBody>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default TradeDialog;
