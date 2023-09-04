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
    const bgColor = 'rgba(47,59,151,0.5)';
    const hoverColor = 'rgba(47,59,151,0.75)';
    const borderColor = 'rgba(47,59,151,1)';

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

    return (
        <>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                <UserDataItem
                    name={name}
                    accountRs={accountRs}
                    IGNISBalance={IGNISBalance}
                    GIFTZBalance={GIFTZBalance}
                    GEMBalance={GEMBalance.toFixed(2)}
                    WETHBalance={WETHBalance.toFixed(6)}
                    MANABalance={MANABalance.toFixed(2)}
                    bgColor={bgColor}
                    borderColor={borderColor}
                />
                <GridItem>
                    <Box
                        p={4}
                        bgColor={bgColor}
                        rounded="lg"
                        mb={2}
                        border="1px"
                        borderColor={borderColor}
                        shadow="dark-lg">
                        <Heading fontSize="lg" pb={2}>
                            Backup your passphrase
                        </Heading>
                        <Text fontSize="sm" pb={2} textAlign="justify">
                            Risk of losing your funds and cards: You store your passphrase on your device. You should
                            export the passphrase and store it somewhere safe.
                        </Text>
                        <Text fontSize="sm" textAlign="justify">
                            The passphrase is stored encrypted, however you shouldnt use the game wallet for significant
                            funds. If you ever give this device to somebody else, you should delete your information
                            from it.
                        </Text>
                        <Box>
                            <Center>
                                <HStack spacing={2} pt={4}>
                                    <PinInput
                                        size="lg"
                                        placeholder="🔒"
                                        variant="filled"
                                        mask
                                        onComplete={handleCheckPinBackup}
                                        onChange={handleCheckPinBackup}
                                        isInvalid={isInvalidPinBackup}>
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                    </PinInput>
                                </HStack>
                            </Center>
                            <Button
                                color="white"
                                mt={4}
                                w="100%"
                                bgColor={bgColor}
                                _hover={{ bgColor: hoverColor }}
                                isDisabled={isInvalidPinBackup}
                                onClick={!isInvalidPinBackup ? onOpenBackup : undefined}>
                                Export passphrase
                            </Button>
                        </Box>
                    </Box>
                </GridItem>
                <GridItem>
                    <Box
                        p={4}
                        bgColor={bgColor}
                        rounded="lg"
                        mb={2}
                        border="1px"
                        borderColor={borderColor}
                        shadow="dark-lg">
                        <Heading fontSize="lg" pb={2}>
                            Delete account from device
                        </Heading>
                        <Text fontSize="sm" textAlign="justify">
                            This deletes stored information from this device. Your account remains available on the
                            network, use Backup Passphrase to save your private key for later use.
                        </Text>
                        <Box>
                            <Center>
                                <HStack spacing={2} pt={4}>
                                    <PinInput
                                        size="lg"
                                        placeholder="🔒"
                                        variant="filled"
                                        mask
                                        onComplete={handleCheckPinDelete}
                                        onChange={handleCheckPinDelete}
                                        isInvalid={isInvalidPinDelete}>
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                    </PinInput>
                                </HStack>
                            </Center>
                            <Button
                                color="white"
                                mt={4}
                                w="100%"
                                _hover={{ bgColor: hoverColor }}
                                bgColor={bgColor}
                                isDisabled={isInvalidPinDelete}
                                onClick={!isInvalidPinDelete ? onOpenDelete : undefined}>
                                Delete account
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
        </>
    );
};

export default Account;
