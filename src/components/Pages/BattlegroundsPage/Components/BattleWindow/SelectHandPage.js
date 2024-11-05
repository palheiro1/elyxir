import {
    Box,
    Button,
    Center,
    HStack,
    Heading,
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
    useMediaQuery,
    useToast,
} from '@chakra-ui/react';
import locations from '../../assets/LocationsEnum';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { useEffect, useState } from 'react';
import { getAsset } from '../../../../../services/Ardor/ardorInterface';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { sendCardsToBattle } from '../../../../../services/Ardor/omnoInterface';
import { errorToast } from '../../../../../utils/alerts';
import { checkPin } from '../../../../../utils/walletUtils';
import {
    formatAddress,
    getContinentIcon,
    getLevelIconString,
    getMediumIcon,
    isEmptyObject,
} from '../../Utils/BattlegroundsUtils';
import { getSoldiers } from '../../../../../services/Battlegrounds/Battlegrounds';

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
    defenderCards,
}) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [battleCost, setBattleCost] = useState({});
    const [medium, setMedium] = useState();
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [preSelectedCard, setPreSelectedCard] = useState(null);
    const [defenderBonus, setDefenderBonus] = useState({
        medium: 0,
        domain: 0,
    });

    const statistics = [
        { name: 'Level', value: locations[arenaInfo.id - 1].rarity },
        { name: 'Medium', value: medium },
        { name: 'Continent', value: domainName },
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

        if (arenaInfo) {
            if (!isEmptyObject(arenaInfo.battleCost)) {
                getBattleCost();
            }
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
        if (!isEmptyObject(battleCost)) {
            const gemBalance = parseInt(omnoGEMsBalance);
            const wethBalance = parseInt(omnoWethBalance);
            const battleCostGems = parseInt(battleCost[0].price);
            const battleCostWeth = battleCost.length > 1 ? parseInt(battleCost[1].price) : 0;

            if (battleCostGems > gemBalance) {
                return errorToast('Insuficient GEM balance', toast);
            }

            if (battleCost.length > 1 && battleCostWeth > wethBalance) {
                return errorToast('Insuficient wETH balance', toast);
            }
        }

        setDisableButton(true);
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

    const [isLowHeight] = useMediaQuery('(max-height: 700px)');

    const getImageSrc = (name, value) => {
        if (name === 'Level') return getLevelIconString(value);
        if (name === 'Medium') return getMediumIcon(value);
        if (name === 'Continent') return getContinentIcon(value);
        return null;
    };

    const handleDeleteCard = (card, index) => {
        if (preSelectedCard && preSelectedCard.asset === card.asset) {
            deleteCard(index);
            setPreSelectedCard(null);
        } else {
            setPreSelectedCard(card);
        }
    };

    useEffect(() => {
        const getDefenderBonus = async () => {
            const defenderSoldiers = await getSoldiers()
                .then(res => res.soldier)
                .then(soldiers => soldiers.filter(soldier => defenderCards.some(card => card.asset === soldier.asset)))
                .catch(error => console.error(error));
            let domainBonus = 0;
            let mediumBonus = 0;
            defenderSoldiers.forEach(soldier => {
                if (soldier.mediumId === arenaInfo.mediumId) mediumBonus++;
                if (soldier.domainId === arenaInfo.domainId) domainBonus++;
            });
            setDefenderBonus({
                medium: mediumBonus,
                domain: domainBonus,
            });
        };
        getDefenderBonus();
    }, [arenaInfo.domainId, arenaInfo.mediumId, defenderCards]);
    return (
        <>
            <Box display={'flex'} flexDir={'column'} overflowY={'scroll'} maxH={'95%'} className="custom-scrollbar">
                <Stack direction={'column'} mx={'auto'} mt={isMobile ? 4 : 8}>
                    <Heading
                        color={'#FFF'}
                        size={isMobile ? 'md' : 'lg'}
                        fontFamily={'Chelsea Market, system-ui'}
                        fontWeight={'300'}>
                        {' '}
                        CONQUER{' '}
                        <span style={{ color: '#D08FB0', textTransform: 'uppercase' }}>
                            {locations[arenaInfo.id - 1].name}
                        </span>{' '}
                    </Heading>
                </Stack>
                <Stack
                    direction={'row'}
                    mx={'auto'}
                    mt={isMobile ? 1 : 4}
                    fontSize={'md'}
                    justify="space-between"
                    textAlign={'center'}
                    w={'60%'}>
                    {statistics.map(({ name, value }, index) => (
                        <Stack direction={'column'} key={index} textAlign={'center'} my={2} mx={'auto'}>
                            <Stack
                                backgroundColor={'#5A679B'}
                                direction={'row'}
                                border={'2px solid #D597B2'}
                                borderRadius={'40px'}
                                color={'#FFF'}
                                letterSpacing={1}
                                w={isMobile ? '80px' : '155px'}
                                fontSize={isMobile ? 'xs' : 'md'}
                                textAlign={'center'}
                                textTransform={'uppercase'}
                                fontFamily={'Chelsea Market, system-ui'}
                                p={isMobile ? 0 : 2}>
                                <Image src={getImageSrc(name, value)} boxSize={'30px'} />
                                <Text m={'auto'}>{value}</Text>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>

                <Stack bgColor={'#5A679B'} mt={5}>
                    <Stack
                        my={5}
                        direction={'column'}
                        fontSize={isMobile ? 'xs' : 'md'}
                        textAlign={'center'}
                        mx={'auto'}
                        textTransform={'uppercase'}>
                        <Stack direction={'row'} w={'100%'} justifyContent={'space-between'}>
                            <Text
                                color={'#FFF'}
                                p={isMobile ? 0 : 1}
                                w={'fit-content'}
                                fontFamily={'Chelsea Market, system-ui'}
                                fontSize={'larger'}
                                my={'auto'}>
                                {defenderInfo.name || formatAddress(defenderInfo.accountRS)}'S HAND
                            </Text>
                            <Stack direction={'row'} marginRight={2} spacing={8}>
                                <Text
                                    color={'#D597B2'}
                                    my={'auto'}
                                    fontFamily={'Chelsea Market, system-ui'}
                                    fontSize={'lg'}>
                                    BONUS
                                </Text>
                                <Text
                                    color={'#FFF'}
                                    my={'auto'}
                                    fontFamily={'Inter, system-ui'}
                                    fontWeight={500}
                                    textAlign={'end'}
                                    fontSize={'sm'}>
                                    +{defenderBonus.medium} {medium}
                                    {<br></br>}+{defenderBonus.domain} {domainName}
                                </Text>
                            </Stack>
                        </Stack>
                        <Stack direction={'row'} mt={1}>
                            {defenderCards &&
                                defenderCards.map((card, index) => (
                                    <Box
                                        key={index}
                                        backgroundColor={'#465A5A'}
                                        w={isMobile ? '76px' : '127px'}
                                        h={isMobile ? '103px' : '172px'}
                                        gap={'15px'}
                                        display={'flex'}>
                                        <Image src={card.cardImgUrl} w={'100%'} />
                                    </Box>
                                ))}
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    direction={'row'}
                    mx={'auto'}
                    mt={isMobile ? 1 : 4}
                    w={isLowHeight ? '90%' : '70%'}
                    justifyContent={'space-between'}
                    fontSize={isMobile ? 'xs' : 'md'}
                    fontWeight={100}
                    gap={10}>
                    <Text
                        color={'#FFF'}
                        textAlign={'center'}
                        my={'auto'}
                        fontFamily={'Chelsea Market, system-ui'}
                        fontSize={isMobile ? 'md' : 'large'}>
                        CHOOSE YOUR HAND
                    </Text>
                    <Stack direction={'row'} spacing={8}>
                        <Text color={'#D597B2'} my={'auto'} fontFamily={'Chelsea Market, system-ui'} fontSize={'lg'}>
                            TRIBUTE
                        </Text>
                        <Stack
                            direction={'column'}
                            my={'auto'}
                            ml={2}
                            fontFamily={'Inter, system-ui'}
                            fontWeight={500}
                            fontSize={'sm'}>
                            {battleCost && !isEmptyObject(battleCost) ? (
                                battleCost.map((item, index) => (
                                    <Text key={index} color={'#FFF'}>
                                        {item.price / NQTDIVIDER} {item.name}
                                    </Text>
                                ))
                            ) : (
                                <Text color={'#FFF'}>FREE</Text>
                            )}
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} marginRight={2} spacing={8}>
                        <Text color={'#D597B2'} my={'auto'} fontFamily={'Chelsea Market, system-ui'} fontSize={'lg'}>
                            BONUS
                        </Text>
                        <Text
                            color={'#FFF'}
                            textTransform={'uppercase'}
                            my={'auto'}
                            fontFamily={'Inter, system-ui'}
                            textAlign={'end'}
                            fontWeight={500}
                            fontSize={'sm'}>
                            +{mediumBonus} {medium}
                            {<br></br>}+{domainBonus} {domainName}
                        </Text>
                    </Stack>
                </Stack>
                <Stack direction={'row'} mx={'auto'} mt={3}>
                    {handBattleCards.map((card, index) => {
                        const isPreSelected = preSelectedCard?.asset === card.asset;

                        return card !== '' ? (
                            <Box key={index} position="relative" onClick={() => handleDeleteCard(card, index)}>
                                {isPreSelected && (
                                    <Box
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        width="100%"
                                        height="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize={'xl'}
                                        bg="rgba(1, 151, 135, 0.5)"
                                        fontFamily={'Chelsea Market, system-ui'}>
                                        x
                                    </Box>
                                )}
                                <Box
                                    backgroundColor={'#465A5A'}
                                    w={isMobile ? '76px' : '127px'}
                                    h={isMobile ? '103px' : '172px'}
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
                                w={isMobile ? '76px' : '127px'}
                                h={isMobile ? '103px' : '172px'}
                                position="relative"
                                gap="15px"
                                display="flex"
                                sx={{
                                    border: index === 0 ? '2px solid #D08FB0' : 'none',
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
                                        Alpha slot{' '}
                                    </Text>
                                ) : null}
                            </Box>
                        );
                    })}
                </Stack>
                <Box
                    mx="auto"
                    borderRadius="30px"
                    p="3px"
                    background="linear-gradient(49deg, rgba(235,178,185,1) 0%, rgba(32,36,36,1) 100%)"
                    display="inline-block"
                    mt={isMobile ? 3 : 6}>
                    <Button
                        sx={{
                            background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                            borderRadius: '30px',
                            color: '#FFF',
                            textTransform: 'uppercase',
                            fontWeight: '400',
                            letterSpacing: '1px',
                            fontSize: isMobile ? 'md' : 'lg',
                            fontFamily: "'Chelsea Market', system-ui",
                            padding: isMobile ? '5' : '6',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onClick={onOpen}>
                        Start a Battle
                    </Button>
                </Box>
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
                        <Button
                            color={'#fff'}
                            bgColor="#F48794"
                            mx={'auto'}
                            w={'80%'}
                            onClick={handleStartBattle}
                            isDisabled={disableButton}>
                            Play
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
