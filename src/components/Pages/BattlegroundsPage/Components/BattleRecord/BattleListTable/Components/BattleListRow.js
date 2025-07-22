import { Grid, GridItem, Box, Tooltip, Image, Text } from '@chakra-ui/react';
import { Fragment } from 'react';
import victoryIcon from '../../../../assets/icons/victory_icon.svg';
import defeatIcon from '../../../../assets/icons/defeat_icon.svg';
import { formatAddress } from '../../../../Utils/BattlegroundsUtils';
import { NQTDIVIDER } from '../../../../../../../data/CONSTANTS';
import ResponsiveTooltip from '../../../../../../ui/ReponsiveTooltip';

/**
 * @name BattleListRow
 * @description Renders a single row in the Battle List Table. It shows information about a specific battle, including date, opponent, arena, role (attacker or defender),
 * result (victory or defeat), and rewards (captured cards and asset rewards). The row is clickable to view detailed battle information.
 * @param {Object} item - Battle data object containing all necessary details of a single battle.
 * @param {Function} handleViewDetails - Callback to trigger when the row is clicked, passing the battle ID.
 * @param {Array} cards - Array of all card objects used to match captured assets with card details.
 * @param {Boolean} isMobile - Flag indicating if the view is mobile, used to adjust font and image sizes.
 * @param {Array} battleReward - List of reward assets (wETH, GEM, etc.) with their respective values from the battle.
 * @returns {JSX.Element} A grid row with interactive tooltips and conditionally rendered reward data.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleListRow = ({ item, handleViewDetails, cards, isMobile, battleReward }) => {
    const captured =
        item?.capturedAsset && cards?.length
            ? cards.find(obj => Object.keys(item.capturedAsset || {}).includes(obj.asset))
            : null;

    const attackerName = item?.attackerDetails?.name || formatAddress(item?.attackerDetails?.accountRS || '');
    const defenderName = item?.defenderDetails?.name || formatAddress(item?.defenderDetails?.accountRS || '');
    const participantName = item?.isUserDefending ? attackerName : defenderName;
    const isWin = item?.isUserDefending === item?.isDefenderWin;

    return (
        <Grid
            color="#FFF"
            templateColumns="repeat(6, 1fr)"
            p={3}
            my={4}
            alignItems="center"
            bg="transparent"
            cursor="pointer"
            _hover={{ backgroundColor: 'whiteAlpha.300', borderRadius: '25px' }}
            onClick={() => item?.battleId && handleViewDetails(item.battleId)}>
            <GridItem textAlign="center">
                <Box {...cellProps(isMobile)}>{item?.date || 'N/A'}</Box>
            </GridItem>

            <GridItem textAlign="center">
                <Tooltip
                    label={item?.isUserDefending ? item?.attackerDetails?.accountRS : item?.defenderDetails?.accountRS}
                    hasArrow
                    placement="bottom">
                    <Box {...cellProps(isMobile)}>{participantName}</Box>
                </Tooltip>
            </GridItem>

            <GridItem textAlign="center">
                <Box {...cellProps(isMobile)} ml={3}>
                    {item?.arenaName || 'Unknown Arena'}
                </Box>
            </GridItem>

            <GridItem textAlign="center">
                <Box {...cellProps(isMobile)} ml={3}>
                    <Image
                        src={`/images/battlegrounds/${item?.isUserDefending ? 'defense_icon.svg' : 'attack_icon.svg'}`}
                        boxSize={isMobile ? '30px' : '45px'}
                    />
                </Box>
            </GridItem>

            <GridItem textAlign="center">
                <Box {...cellProps(isMobile)} ml={4}>
                    <Image src={isWin ? victoryIcon : defeatIcon} boxSize={isMobile ? '30px' : '45px'} />
                </Box>
            </GridItem>

            {cards?.length > 0 && (
                <GridItem textAlign="center" onClick={e => e.stopPropagation()}>
                    <ResponsiveTooltip
                        label={
                            captured?.cardImgUrl && (
                                <Image src={captured.cardImgUrl} w="150px" alt={captured?.name || 'Captured'} />
                            )
                        }
                        placement={isMobile ? 'auto' : 'top'}
                        hasArrow>
                        <Box {...cellProps(isMobile)} cursor="pointer">
                            <Text
                                color={isWin ? '#7FC0BE' : '#D597B2'}
                                border="2px solid white"
                                p={2}
                                borderRadius="20px"
                                w={isMobile ? '100px' : '130px'}
                                textAlign="center"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis">
                                {captured?.name || 'No Reward'}
                                {isWin &&
                                    battleReward?.length > 0 &&
                                    battleReward.map(({ price = 0, name = '' }, i) => (
                                        <Fragment key={i}>
                                            {' + '}
                                            {price / NQTDIVIDER} {name}
                                        </Fragment>
                                    ))}
                            </Text>
                        </Box>
                    </ResponsiveTooltip>
                </GridItem>
            )}
        </Grid>
    );
};

const cellProps = isMobile => ({
    bgColor: 'transparent',
    fontFamily: 'Inter, System',
    fontWeight: '700',
    fontSize: isMobile ? 'xs' : 'sm',
    p: 3,
    maxH: '45px',
    h: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export default BattleListRow;
