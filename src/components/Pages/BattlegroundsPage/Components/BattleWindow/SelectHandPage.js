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
import { formatAddress } from '../../Utils/BattlegroundsUtils';

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
    omnoGEMsBalance,
    omnoWethBalance,
    setShowResults,
    setCurrentTime,
    isMobile,
}) => {
    /* mediums: 
        1 -> terrestial 
        2 -> aerial
        3 -> acuatic
    */
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [battleCost, setBattleCost] = useState([]);
    const [medium, setMedium] = useState();
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');

    const statistics = [
        { name: 'Level', value: locations[arenaInfo.id - 1].rarity },
        { name: 'Medium', value: medium },
        { name: 'Team size', value: 5 },
        { name: 'Defender', value: defenderInfo.name || formatAddress(defenderInfo.accountRS) },
    ];

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
                        setMedium('Terrestrial');
                        break;
                    case 2:
                        setMedium('Aerial');
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
        if (!isValidPin || !passphrase) return errorToast('The pin is not correct', toast);
        let allEmpty = true;

        for (let i = 0; i < handBattleCards.length; i++) {
            if (handBattleCards[i] !== '') {
                allEmpty = false;
                break;
            }
        }

        if (allEmpty) {
            return errorToast('Select at least one card to start a battle', toast);
        }
        const gemBalance = omnoGEMsBalance / NQTDIVIDER;
        const wethBalance = omnoWethBalance / NQTDIVIDER;
        const battleCostGems = battleCost[0].price / NQTDIVIDER;
        const battleCostWeth = battleCost.length > 1 ? battleCost[1].price / NQTDIVIDER : 0;

        if (battleCost.length > 1) {
            if (battleCostGems > gemBalance || battleCostWeth > wethBalance) {
                return errorToast('Insuficient balance', toast);
            }
        }

        if (battleCostGems > gemBalance) {
            return errorToast('Insuficient balance', toast);
        }

        await sendCardsToBattle({ cards: handBattleCards, passPhrase: passphrase, arenaId: arenaInfo.id });
        onClose();
        setCurrentTime(new Date().toISOString());
        setShowResults(true);
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
                <Stack direction={'column'} mx={'auto'} mt={isMobile ? 4 : 8}>
                    <Heading color={'#FFF'} size={isMobile ? 'md' : 'xl'} fontFamily={'Chelsea Market, system-ui'}>
                        {' '}
                        CONQUER{' '}
                        <span style={{ color: '#D08FB0' }}>
                            {locations[arenaInfo.id - 1].name}, {domainName}
                        </span>{' '}
                    </Heading>
                    <Text color={'#FFF'} textAlign={'center'} fontSize={isMobile ? 'md' : 'large'}>
                        SELECT YOUR ARMY
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
                                    right="0"
                                    backgroundColor={'#D08FB0'}
                                    borderRadius={'full'}
                                    onClick={() => deleteCard(index)}
                                />
                                <Box
                                    backgroundColor={'#465A5A'}
                                    w={isMobile ? '100px' : '150px'}
                                    h={isMobile ? '135px' : '200px'}
                                    gap={'15px'}
                                    display={'flex'}>
                                    <Image src={card.cardImgUrl} w={'100%'} />
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                key={index}
                                backgroundColor="#465A5A"
                                cursor={'pointer'}
                                w={isMobile ? '100px' : '150px'}
                                h={isMobile ? '135px' : '200px'}
                                position="relative"
                                gap="15px"
                                display="flex"
                                sx={{
                                    border: index === 0 ? '2px solid #D08FB0' : 'none',
                                    borderImage:
                                        index === 0
                                            ? `linear-gradient(90deg, rgba(163,161,81,1) 0%, rgba(219,227,82,1) 35%, rgba(244,135,148,1) 100%) 1`
                                            : 'none',
                                }}
                                onClick={() => openInventory(index)}>
                                <Text
                                    fontFamily={'Chelsea Market, system-ui'}
                                    fontSize={'xl'}
                                    color={'#FFF'}
                                    m={'auto'}>
                                    +
                                </Text>
                                {index === 0 ? (
                                    <Text
                                        fontSize={isMobile && 'small'}
                                        pos={'absolute'}
                                        bottom={0}
                                        left={1}
                                        fontFamily={'Chelsea Market, system-ui'}
                                        color={'#fff'}>
                                        Hero slot{' '}
                                    </Text>
                                ) : null}
                            </Box>
                        )
                    )}
                </Stack>
                <Stack direction={'row'} mx={'auto'} mt={isMobile ? 2 : 4} fontSize={'md'}>
                    {statistics.map((item, index) => (
                        <Stack direction={'column'} key={index} textAlign={'center'} m={2}>
                            <Text
                                color={'#FFF'}
                                fontFamily={'Chelsea Market, system-ui'}
                                fontSize={isMobile ? 'sm' : 'lg'}>
                                {item.name}
                            </Text>
                            <Text
                                backgroundColor={'#484848'}
                                border={'2px solid #D597B2'}
                                borderRadius={'40px'}
                                color={'#FFF'}
                                w={isMobile ? '80px' : '120px'}
                                fontSize={isMobile ? 'xs' : 'md'}
                                textAlign={'center'}
                                fontFamily={'Chelsea Market, system-ui'}
                                p={isMobile ? 0 : 2}>
                                {item.value}
                            </Text>
                        </Stack>
                    ))}
                </Stack>
                <Stack
                    direction={'row'}
                    mx={'auto'}
                    mt={isMobile ? 2 : 4}
                    fontFamily={'Chelsea Market, system-ui'}
                    fontSize={isMobile ? 'xs' : 'md'}
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
                                battleCost.map((item, index) => (
                                    <Text key={index} color={'#FFF'}>
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
                    padding={isMobile ? 5 : 7}
                    textTransform={'uppercase'}
                    color={'#FFF'}
                    fontWeight={'100'}
                    borderRadius={'30px'}
                    mt={isMobile ? 3 : 6}
                    fontSize={isMobile ? 'md' : 'x-large'}
                    fontFamily={'Chelsea Market, system-ui'}
                    onClick={onOpen}>
                    Start battle
                </Button>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bgColor={'#ebb2b9'} border={'2px solid #F48794'}>
                    <ModalHeader mx={'auto'}>Insert your pin</ModalHeader>
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
                        <Button color={'#fff'} bgColor="#F48794" mx={'auto'} w={'80%'} onClick={handleStartBattle}>
                            Play
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
