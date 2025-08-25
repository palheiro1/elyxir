import { CloseIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, Stack, Text } from '@chakra-ui/react';

/**
 * @name AttackerCards
 * @description Displays the attacker's selected hand cards with bonus information.
 * Shows the current bonus for medium and domain, and renders each card or an empty slot.
 * Cards can be pre-selected for deletion, showing an overlay "x" indicator.
 * Empty slots show a clickable box that triggers the inventory opening.
 * The component adapts layout and sizes for mobile and low height screens.
 * @param {Array} handBattleCards - Array of cards currently selected for battle (may include empty strings).
 * @param {Object|null} preSelectedCard - Card currently pre-selected for deletion.
 * @param {Function} handleDeleteCard - Handler to delete a card when clicked.
 * @param {Function} openInventory - Handler to open inventory for adding a card.
 * @param {boolean} isMobile - Flag indicating if the display is on a mobile device.
 * @param {boolean} isLowHeight - Flag for low height screens to adjust width.
 * @param {number} mediumBonus - Numeric bonus related to the battle medium.
 * @param {string} medium - Name of the battle medium (e.g., "Terrestrial").
 * @param {number} domainBonus - Numeric bonus related to the domain.
 * @param {string} domainName - Name of the domain.
 * @returns {JSX.Element} JSX layout displaying the attacker's hand and bonuses.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const AttackerCards = ({
    handBattleCards,
    preSelectedCard,
    handleDeleteCard,
    openInventory,
    isMobile,
    isLowHeight,
    mediumBonus,
    medium,
    domainBonus,
    domainName,
    handleResetHandBattleCards,
}) => {
    const showResetButton = handBattleCards.some(card => card !== '');
    return (
        <>
            <Stack
                direction={'row'}
                mx={'auto'}
                mt={isMobile ? 1 : 4}
                w={isLowHeight ? '90%' : '80%'}
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
            <Stack direction={'row'} mx={'auto'} mt={3} position={'relative'}>
                {handBattleCards.map((card, index) => {
                    const isPreSelected = preSelectedCard?.asset === card.asset;

                    return card !== '' ? (
                        <Box
                            key={index}
                            position="relative"
                            onClick={() => handleDeleteCard(card, index)}
                            _hover={{ transform: 'scale(1.05)' }}
                            transition="transform 0.2s">
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
                            _hover={{ transform: 'scale(1.05)' }}
                            transition="transform 0.2s"
                            sx={{
                                border: index === 0 ? '2px solid #D08FB0' : 'none',
                            }}
                            onClick={() => openInventory(index)}>
                            <Text fontFamily={'Chelsea Market, system-ui'} fontSize={'xl'} color={'#FFF'} m={'auto'}>
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
                })}{' '}
                {showResetButton && (
                    <IconButton
                        color={'#FFF'}
                        position={'absolute'}
                        icon={<CloseIcon />}
                        onClick={handleResetHandBattleCards}
                        bottom={0}
                        right={-12}
                    />
                )}
            </Stack>
        </>
    );
};

export default AttackerCards;
