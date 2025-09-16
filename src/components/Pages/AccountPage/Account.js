import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    PinInput,
    PinInputField,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
    Icon,
    Divider,
    Avatar,
    Tooltip,
    SimpleGrid,
    Spacer
} from '@chakra-ui/react';
import { FaUserCircle, FaKey, FaTrashAlt, FaUserShield } from 'react-icons/fa';

import { useEffect, useRef, useState } from 'react';
import { checkPin } from '../../../utils/walletUtils';
import BackupDialog from '../../Modals/BackupDialog/BackupDialog';
import ConfirmDialog from '../../Modals/ConfirmDialog/ConfirmDialog';
import { useToast } from '@chakra-ui/react';
import { checkCanClaim, getRewardsFaucet } from '../../../services/Faucet/faucet';
import { okToast, errorToast } from '../../../utils/alerts';

import { useNavigate } from 'react-router-dom';

/**
 * @name Account
 * @description Account page
 * @param {object} infoAccount - account info
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Account = ({ infoAccount }) => {
    const { accountRs, publicKey, name, IGNISBalance, GIFTZBalance, GEMBalance, WETHBalance, MANABalance } = infoAccount;
    // Daily Rewards logic (from UserDataItem)
    const [isClaimable, setIsClaimable] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [claimDebug, setClaimDebug] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const checkClaimable = async () => {
            try {
                const res = await checkCanClaim(accountRs);
                setClaimDebug(res);
                setIsClaimable(!res.error);
            } catch (err) {
                setClaimDebug({ error: true, message: err?.message || String(err) });
                setIsClaimable(false);
            }
        };
        checkClaimable();
    }, [accountRs]);

    const handleClaim = async () => {
        try {
            setIsDisabled(true);
            const response = await getRewardsFaucet(accountRs, publicKey);
            if (!response.error) {
                okToast(response.message, toast);
                setIsClaimable(false);
            } else {
                errorToast(response.message, toast);
            }
        } catch (error) {
            console.error('🚀 ~ file: Account.js:handleClaim ~ error:', error);
            errorToast(error.response?.message || 'ERROR', toast);
        }
        setIsDisabled(false);
    };
    const [isInvalidPinBackup, setIsInvalidPinBackup] = useState(true);
    const [isInvalidPinDelete, setIsInvalidPinDelete] = useState(true);
    const [needReload, setNeedReload] = useState(false);
    const [passphrase, setPassphrase] = useState();
    // Modern, creative palette
    const bgGradient = useColorModeValue(
        'linear-gradient(120deg, #f8fafc 0%, #e9d8fd 100%)',
        'linear-gradient(120deg, #232946 0%, #3d246c 100%)'
    );
    const cardBg = useColorModeValue('white', 'gray.900');
    const borderColor = useColorModeValue('purple.200', 'purple.700');
    const accentColor = useColorModeValue('purple.700', 'purple.200');
    const shadow = useColorModeValue('0 6px 32px rgba(78,59,151,0.10)', '0 6px 32px rgba(78,59,151,0.25)');
    const iconColor = useColorModeValue('purple.500', 'purple.200');
    const dangerColor = useColorModeValue('red.500', 'red.300');
    const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
    const labelColor = useColorModeValue('gray.500', 'gray.400');

    const navigate = useNavigate();

    const { isOpen: isOpenBackup, onOpen: onOpenBackup, onClose: onCloseBackup } = useDisclosure();
    const refBackup = useRef();

    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const refDelete = useRef();

    useEffect(() => {
        const refresh = () => {
            setNeedReload(false);
            navigate('/login');
        };
        needReload && refresh();
    }, [needReload, navigate]);

    const handleCheckPinBackup = pin => {
        const user = checkPin(name, pin);
        if (!user) {
            setIsInvalidPinBackup(true);
            return;
        }
        setIsInvalidPinBackup(false);
        setPassphrase(user.passphrase);
    };

    const handleCheckPinDelete = pin => {
        const user = checkPin(name, pin);
        if (!user) {
            setIsInvalidPinDelete(true);
            return;
        }
        setIsInvalidPinDelete(false);
    };

    // (Removed duplicate textColor declaration)

    return (
        <Box minH="100vh" bg={bgGradient} py={{ base: 6, md: 12 }} px={{ base: 2, md: 8 }}>
            <Flex direction="column" align="center" maxW="900px" mx="auto" w="100%">
                {/* Profile Card */}
                <Box
                    w="100%"
                    bg={cardBg}
                    borderRadius="2xl"
                    boxShadow={shadow}
                    borderWidth="1.5px"
                    borderColor={borderColor}
                    mb={10}
                    p={{ base: 6, md: 10 }}
                    position="relative"
                >
                    <Flex align="center" gap={6} direction={{ base: 'column', md: 'row' }}>
                        <Avatar size="2xl" name={name} icon={<FaUserCircle fontSize="2.5rem" />} bg={iconColor} color="white" boxShadow="md" />
                        <VStack align="start" spacing={1} flex={1} w="100%">
                            <HStack>
                                <Heading size="lg" color={accentColor} fontWeight="extrabold">{name}</Heading>
                                <Tooltip label="Account ID" fontSize="xs"><Icon as={FaUserShield} color={iconColor} /></Tooltip>
                            </HStack>
                            <Text fontSize="sm" color={labelColor} fontWeight="medium">{accountRs}</Text>
                            <Divider my={2} />
                            {/* Only IGNIS and GEM with custom icons */}
                            <SimpleGrid columns={2} spacing={4} w="100%">
                                <Flex align="center" gap={2}>
                                    <Box as="img" src={process.env.PUBLIC_URL + '/images/currency/ignis.png'} alt="Ignis" boxSize="32px" />
                                    <Text fontWeight="bold" color={textColor} fontSize="sm">IGNIS</Text>
                                    <Text color={labelColor} fontSize="sm">{IGNISBalance}</Text>
                                </Flex>
                                <Flex align="center" gap={2}>
                                    <Box as="img" src={process.env.PUBLIC_URL + '/images/currency/gem.png'} alt="Gem" boxSize="32px" />
                                    <Text fontWeight="bold" color={textColor} fontSize="sm">GEM</Text>
                                    <Text color={labelColor} fontSize="sm">{GEMBalance.toFixed(2)}</Text>
                                </Flex>
                            </SimpleGrid>
                        </VStack>
                    </Flex>
                    {/* Daily Rewards Section (modern, with debug info) */}
                    <Box mt={8} w="100%" bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="xl" p={{ base: 4, md: 6 }} boxShadow={useColorModeValue('md', 'dark-lg')} borderWidth="1px" borderColor={borderColor}>
                        <Heading as="h2" size="md" color={accentColor} mb={2} fontWeight="bold">Daily rewards</Heading>
                        <Box>
                            {isClaimable ? (
                                <>
                                    <Button
                                        w="100%"
                                        bgColor={cardBg}
                                        borderColor={borderColor}
                                        onClick={handleClaim}
                                        isDisabled={isDisabled}
                                    >
                                        Claim
                                    </Button>
                                    <Text fontSize={'xs'} mt={2}>
                                        Here you can get some daily rewards (1 IGNIS, 1 GEM and 1 MANA)
                                    </Text>
                                </>
                            ) : (
                                <Text fontSize="md" color={textColor}>No more rewards today, come back tomorrow!</Text>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Actions Section */}
                <Flex w="100%" gap={8} direction={{ base: 'column', md: 'row' }}>
                    {/* Backup Passphrase Card */}
                    <Box
                        flex={1}
                        bg={cardBg}
                        borderRadius="2xl"
                        boxShadow={shadow}
                        borderWidth="1.5px"
                        borderColor={borderColor}
                        p={{ base: 5, md: 8 }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        minW={0}
                    >
                        <Icon as={FaKey} color={accentColor} boxSize={8} mb={2} />
                        <Heading fontSize={{ base: 'md', md: 'lg' }} color={accentColor} fontWeight="bold" mb={2} textAlign="center">
                            Backup your passphrase
                        </Heading>
                        <Text fontSize="sm" color={labelColor} mb={2} textAlign="center">
                            Risk of losing your funds and cards: You store your passphrase on your device. You should export the passphrase and store it somewhere safe.
                        </Text>
                        <Text fontSize="sm" color={labelColor} mb={4} textAlign="center">
                            The passphrase is stored encrypted, however you shouldn’t use the game wallet for significant funds. If you ever give this device to somebody else, you should delete your information from it.
                        </Text>
                        <HStack justify="center" w="100%" mt={2} mb={2}>
                            <PinInput
                                size="lg"
                                variant="filled"
                                mask
                                onComplete={handleCheckPinBackup}
                                onChange={handleCheckPinBackup}
                                isInvalid={isInvalidPinBackup}
                                focusBorderColor={accentColor}
                            >
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                        <Button
                            colorScheme="purple"
                            color="white"
                            mt={6}
                            w="100%"
                            fontWeight={'bold'}
                            fontSize={{ base: 'sm', md: 'md' }}
                            leftIcon={<FaKey />}
                            bgGradient="linear(to-r, purple.500, purple.700)"
                            _hover={{ bgGradient: 'linear(to-r, purple.600, purple.800)', boxShadow: '0 2px 12px rgba(78,59,151,0.18)' }}
                            isDisabled={isInvalidPinBackup}
                            onClick={!isInvalidPinBackup ? onOpenBackup : undefined}
                            transition="all 0.2s"
                        >
                            EXPORT PASSPHRASE
                        </Button>
                    </Box>

                    {/* Delete Account Card */}
                    <Box
                        flex={1}
                        bg={cardBg}
                        borderRadius="2xl"
                        boxShadow={shadow}
                        borderWidth="1.5px"
                        borderColor={borderColor}
                        p={{ base: 5, md: 8 }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        minW={0}
                    >
                        <Icon as={FaTrashAlt} color={dangerColor} boxSize={8} mb={2} />
                        <Heading fontSize={{ base: 'md', md: 'lg' }} color={dangerColor} fontWeight="bold" mb={2} textAlign="center">
                            Delete account from device
                        </Heading>
                        <Text fontSize="sm" color={labelColor} mb={4} textAlign="center">
                            This deletes stored information from this device. Your account remains available on the network, use Backup Passphrase to save your private key for later use.
                        </Text>
                        <HStack justify="center" w="100%" mt={2} mb={2}>
                            <PinInput
                                size="lg"
                                variant="filled"
                                mask
                                onComplete={handleCheckPinDelete}
                                onChange={handleCheckPinDelete}
                                isInvalid={isInvalidPinDelete}
                                focusBorderColor={dangerColor}
                            >
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                        <Button
                            colorScheme="red"
                            color="white"
                            mt={6}
                            w="100%"
                            fontWeight={'bold'}
                            fontSize={{ base: 'sm', md: 'md' }}
                            leftIcon={<FaTrashAlt />}
                            bgGradient="linear(to-r, red.500, red.700)"
                            _hover={{ bgGradient: 'linear(to-r, red.600, red.800)', boxShadow: '0 2px 12px rgba(151,59,78,0.18)' }}
                            isDisabled={isInvalidPinDelete}
                            onClick={!isInvalidPinDelete ? onOpenDelete : undefined}
                            transition="all 0.2s"
                        >
                            DELETE ACCOUNT
                        </Button>
                    </Box>
                </Flex>

                {/* Dialogs */}
                {isOpenBackup && (
                    <BackupDialog
                        reference={refBackup}
                        isOpen={isOpenBackup}
                        onClose={onCloseBackup}
                        account={accountRs}
                        username={name}
                        passphrase={passphrase}
                    />
                )}
                {isOpenDelete && (
                    <ConfirmDialog
                        reference={refDelete}
                        isOpen={isOpenDelete}
                        onClose={onCloseDelete}
                        user={name}
                        setNeedReload={setNeedReload}
                    />
                )}
            </Flex>
        </Box>
    );
};

export default Account;
