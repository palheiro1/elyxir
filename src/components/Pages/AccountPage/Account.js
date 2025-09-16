import {
    Box,
    Button,
    Center,
    Grid,
    GridItem,
    Heading,
    HStack,
    PinInput,
    PinInputField,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { checkPin } from '../../../utils/walletUtils';
import BackupDialog from '../../Modals/BackupDialog/BackupDialog';
import ConfirmDialog from '../../Modals/ConfirmDialog/ConfirmDialog';
import UserDataItem from './UserDataItem';

import { useNavigate } from 'react-router-dom';

/**
 * @name Account
 * @description Account page
 * @param {object} infoAccount - account info
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Account = ({ infoAccount }) => {
    const { accountRs, name, IGNISBalance, GIFTZBalance, GEMBalance, WETHBalance, MANABalance } = infoAccount;
    const [isInvalidPinBackup, setIsInvalidPinBackup] = useState(true);
    const [isInvalidPinDelete, setIsInvalidPinDelete] = useState(true);
    const [needReload, setNeedReload] = useState(false);
    const [passphrase, setPassphrase] = useState();
    // Enhanced color palette for a more professional look
    const bgColor = useColorModeValue('linear-gradient(135deg, rgba(245,245,255,0.95) 0%, rgba(230,220,255,0.85) 100%)', 'linear-gradient(135deg, rgba(44,32,99,0.85) 0%, rgba(78,59,151,0.7) 100%)');
    const cardBg = useColorModeValue('white', 'gray.800');
    const hoverColor = useColorModeValue('purple.100', 'purple.700');
    const borderColor = useColorModeValue('purple.300', 'purple.600');
    const accentColor = useColorModeValue('purple.600', 'purple.300');
    const shadow = useColorModeValue('0 4px 24px rgba(78,59,151,0.10)', '0 4px 24px rgba(78,59,151,0.25)');

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

    const textColor = useColorModeValue('purple.900', 'white');

    return (
        <Box
            minH="100vh"
            py={{ base: 6, md: 10 }}
            px={{ base: 2, md: 8 }}
            bg={bgColor}
            borderRadius={{ base: 'none', md: '2xl' }}
            boxShadow={shadow}
            position="relative"
        >
            <Grid
                templateColumns={{ base: '1fr', lg: '1fr 1fr', xl: '1fr 1fr 1fr' }}
                gap={8}
                color={textColor}
                alignItems="stretch"
            >
                <UserDataItem
                    name={name}
                    accountRs={accountRs}
                    publicKey={infoAccount.publicKey}
                    IGNISBalance={IGNISBalance}
                    GIFTZBalance={GIFTZBalance}
                    GEMBalance={GEMBalance.toFixed(2)}
                    WETHBalance={WETHBalance.toFixed(6)}
                    MANABalance={MANABalance.toFixed(2)}
                    bgColor={cardBg}
                    borderColor={borderColor}
                />
                <GridItem>
                    <Box
                        p={{ base: 4, md: 6 }}
                        bg={cardBg}
                        rounded={{ base: 'lg', md: '2xl' }}
                        mb={2}
                        border="1px"
                        borderColor={borderColor}
                        color={textColor}
                        boxShadow={shadow}
                        transition="box-shadow 0.2s"
                        _hover={{ boxShadow: '0 8px 32px rgba(78,59,151,0.18)' }}
                    >
                        <Heading fontSize={{ base: 'lg', md: 'xl' }} pb={2} color={accentColor} fontWeight="bold">
                            Backup your passphrase
                        </Heading>
                        <Text fontSize="sm" pb={2} textAlign="justify">
                            Risk of losing your funds and cards: You store your passphrase on your device. You should
                            export the passphrase and store it somewhere safe.
                        </Text>
                        <Text fontSize="sm" textAlign="justify" pb={2}>
                            The passphrase is stored encrypted, however you shouldn’t use the game wallet for significant
                            funds. If you ever give this device to somebody else, you should delete your information
                            from it.
                        </Text>
                        <Box>
                            <Center>
                                <HStack spacing={2} pt={4}>
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
                            </Center>
                            <Button
                                colorScheme="purple"
                                color="white"
                                mt={6}
                                w="100%"
                                fontWeight={'bold'}
                                fontSize={{ base: 'sm', md: 'md' }}
                                bgGradient="linear(to-r, purple.500, purple.700)"
                                _hover={{ bgGradient: 'linear(to-r, purple.600, purple.800)', boxShadow: '0 2px 12px rgba(78,59,151,0.18)' }}
                                isDisabled={isInvalidPinBackup}
                                onClick={!isInvalidPinBackup ? onOpenBackup : undefined}
                                transition="all 0.2s"
                            >
                                EXPORT PASSPHRASE
                            </Button>
                        </Box>
                    </Box>
                </GridItem>
                <GridItem>
                    <Box
                        p={{ base: 4, md: 6 }}
                        bg={cardBg}
                        rounded={{ base: 'lg', md: '2xl' }}
                        mb={2}
                        border="1px"
                        borderColor={borderColor}
                        color={textColor}
                        boxShadow={shadow}
                        transition="box-shadow 0.2s"
                        _hover={{ boxShadow: '0 8px 32px rgba(78,59,151,0.18)' }}
                    >
                        <Heading fontSize={{ base: 'lg', md: 'xl' }} pb={2} color={accentColor} fontWeight="bold">
                            Delete account from device
                        </Heading>
                        <Text fontSize="sm" textAlign="justify" pb={2}>
                            This deletes stored information from this device. Your account remains available on the
                            network, use Backup Passphrase to save your private key for later use.
                        </Text>
                        <Box>
                            <Center>
                                <HStack spacing={2} pt={4}>
                                    <PinInput
                                        size="lg"
                                        variant="filled"
                                        mask
                                        onComplete={handleCheckPinDelete}
                                        onChange={handleCheckPinDelete}
                                        isInvalid={isInvalidPinDelete}
                                        focusBorderColor={accentColor}
                                    >
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                    </PinInput>
                                </HStack>
                            </Center>
                            <Button
                                colorScheme="red"
                                color="white"
                                mt={6}
                                w="100%"
                                fontWeight={'bold'}
                                fontSize={{ base: 'sm', md: 'md' }}
                                bgGradient="linear(to-r, red.500, red.700)"
                                _hover={{ bgGradient: 'linear(to-r, red.600, red.800)', boxShadow: '0 2px 12px rgba(151,59,78,0.18)' }}
                                isDisabled={isInvalidPinDelete}
                                onClick={!isInvalidPinDelete ? onOpenDelete : undefined}
                                transition="all 0.2s"
                            >
                                DELETE ACCOUNT
                            </Button>
                        </Box>
                    </Box>
                </GridItem>
            </Grid>
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
        </Box>
    );
};

export default Account;
