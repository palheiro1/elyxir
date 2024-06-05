import {
    Box,
    Button,
    Center,
    HStack,
    Heading,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import locations from '../../assets/LocationsEnum';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { getAsset } from '../../../../../services/Ardor/ardorInterface';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { sendCardsToBattle } from '../../../../../services/Ardor/omnoInterface';
import { errorToast } from '../../../../../utils/alerts';
import { checkPin } from '../../../../../utils/walletUtils';

export const SelectHandPage = ({
    arenaInfo,
    handBattleCards,
    openInventory,
    infoAccount,
    defenderInfo,
    deleteCard,
    domainBonus,
    mediumBonus,
    domainName,
}) => {
    const statistics = [
        { name: 'Level', value: 'Epic' },
        { name: 'Medium', value: arenaInfo.mediumId },
        { name: 'Team size', value: 5 },
        { name: 'Defender', value: defenderInfo.name },
    ];
    /* mediums: 
        1 -> aerial
        2 -> terrestial 
        3 -> acuatic
    */
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [battleCost, setBattleCost] = useState([]);
    const [medium, setMedium] = useState();

    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');

    useEffect(() => {
        const getBattleCost = async () => {
            const assets = Object.entries(arenaInfo.battleCost.asset);

            const results = await Promise.all(
                assets.map(async ([asset, price]) => {
                    const assetDetails = await getAsset(asset);
                    return { ...assetDetails, price };
                })
            );

            setBattleCost(results);
        };

        if (arenaInfo && arenaInfo.battleCost && arenaInfo.battleCost.asset) {
            getBattleCost();
        }

        if (arenaInfo) {
            (() => {
                switch (arenaInfo.mediumId) {
                    case 1:
                        setMedium('Aerial');
                        break;
                    case 2:
                        setMedium('Terrestrial');
                        break;
                    case 3:
                        setMedium('Aquatic');
                        break;
                    default:
                        setMedium('Unknown');
                }
            })();
        }
    }, [arenaInfo]);

    const handleStartBattle = async () => {
        console.log(infoAccount);
        for (let i = 0; i < handBattleCards.length; i++) {
            if (handBattleCards[i] === '') return errorToast('Select all cards to start a battle', toast);
        }
        await sendCardsToBattle({ cards: handBattleCards, passPhrase: passphrase, arenaId: arenaInfo.id });
        onClose();
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    return (
        <>
            <Box display={'flex'} flexDir={'column'}>
                <Stack direction={'column'} mx={'auto'} mt={8}>
                    <Heading color={'#FFF'} size={'xl'} fontFamily={'Chelsea Market, system-ui'}>
                        {' '}
                        CONQUER <span style={{ color: '#D08FB0' }}>{locations[arenaInfo.id - 1].name}</span>
                    </Heading>
                    <Text color={'#FFF'} textAlign={'center'} fontSize={'large'}>
                        CHOOSE YOU HAND
                    </Text>
                </Stack>
                <Stack direction={'row'} mx={'auto'} mt={3}>
                    {handBattleCards.map((card, index) =>
                        card !== '' ? (
                            <Box key={index} position="relative">
                                <IconButton
                                    icon={<CloseIcon boxSize={3} />}
                                    zIndex={9}
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    backgroundColor={'#D08FB0'}
                                    borderRadius={'full'}
                                    onClick={() => deleteCard(index)}
                                />
                                <Box backgroundColor={'#465A5A'} w={'150px'} h={'200px'} gap={'15px'} display={'flex'}>
                                    <Image src={card.cardImgUrl} w={'100%'} />
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                key={index}
                                backgroundColor={'#465A5A'}
                                w={'150px'}
                                h={'200px'}
                                gap={'15px'}
                                display={'flex'}
                                onClick={() => openInventory(index)}>
                                <Text
                                    fontFamily={'Chelsea Market, system-ui'}
                                    fontSize={'xl'}
                                    color={'#FFF'}
                                    m={'auto'}>
                                    +
                                </Text>
                            </Box>
                        )
                    )}
                </Stack>
                <Stack direction={'row'} mx={'auto'} mt={4} fontSize={'md'}>
                    {statistics.map((item, index) => (
                        <Stack direction={'column'} key={index} textAlign={'center'} m={2}>
                            <Text color={'#FFF'} fontFamily={'Chelsea Market, system-ui'} fontSize={'lg'}>
                                {item.name}
                            </Text>
                            <Text
                                backgroundColor={'#484848'}
                                border={'2px solid #D597B2'}
                                borderRadius={'40px'}
                                color={'#FFF'}
                                w={'120px'}
                                fontSize={'md'}
                                textAlign={'center'}
                                fontFamily={'Chelsea Market, system-ui'}
                                p={2}>
                                {item.name === 'Medium' ? medium : item.value}
                            </Text>
                        </Stack>
                    ))}
                </Stack>
                <Stack
                    direction={'row'}
                    mx={'auto'}
                    mt={4}
                    fontFamily={'Chelsea Market, system-ui'}
                    fontSize={'md'}
                    fontWeight={100}
                    gap={10}>
                    <Stack direction={'row'} marginRight={2}>
                        <Text color={'#D597B2'} my={'auto'}>
                            BONUS
                        </Text>
                        <Text color={'#FFF'} my={'auto'}>
                            +{mediumBonus} {medium}
                            {<br></br>}+{domainBonus} {domainName}
                        </Text>
                    </Stack>
                    <Stack direction={'row'}>
                        <Text color={'#D597B2'} my={'auto'}>
                            TRIBUTE
                        </Text>
                        <Stack direction={'column'} my={'auto'} ml={2}>
                            {battleCost &&
                                battleCost.map(item => (
                                    <Text color={'#FFF'}>
                                        {item.price / NQTDIVIDER} {item.name}
                                    </Text>
                                ))}
                        </Stack>
                    </Stack>
                </Stack>
                <Button
                    mx={'auto'}
                    style={{
                        background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                        border: '3px solid #EBB2B9',
                    }}
                    padding={7}
                    textTransform={'uppercase'}
                    color={'#FFF'}
                    fontWeight={'100'}
                    borderRadius={'30px'}
                    mt={6}
                    fontSize={'x-large'}
                    fontFamily={'Chelsea Market, system-ui'}
                    onClick={onOpen}>
                    Start battle
                </Button>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>insert you pin</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center>
                            <HStack spacing={7}>
                                <PinInput
                                    size="lg"
                                    onComplete={handleCompletePin}
                                    onChange={handleCompletePin}
                                    isInvalid={!isValidPin}
                                    variant="filled"
                                    mask>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </Center>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleStartBattle}>
                            Play
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
