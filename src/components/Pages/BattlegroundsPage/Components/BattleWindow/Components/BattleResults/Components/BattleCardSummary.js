import { Stack, Text, Image } from '@chakra-ui/react';
import victoryIcon from '../../../../../assets/icons/victory_icon.svg';
import defeatIcon from '../../../../../assets/icons/defeat_icon.svg';
import CardWithOverlay from './CardWithOverlay';

/**
 * @name BattleCardsSummary
 * @description Displays a row of card thumbnails with an overlay "X" on defeated or unused cards, and a final victory/defeat icon.
 * Determines which cards were used in the last round and shows visual feedback accordingly. It differentiates between
 * user and opponent cards and labels them clearly.
 * @param {Object} props
 * @param {Array} props.cards - Full list of card objects including image URLs and metadata (used to match assets).
 * @param {Array} props.armyAssets - Ordered list of asset identifiers (string or number) used to determine which cards to show.
 * @param {Array} props.battleResults - List of battle round results, where the last round determines which cards fought.
 * @param {boolean} props.isWinner - Indicates if the current player won the match (used for icon and overlays).
 * @param {boolean} props.isUser - Indicates if this summary belongs to the user or the opponent (changes title label).
 * @returns {JSX.Element} A summary component showing card miniatures with defeat overlays and a victory/defeat icon.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleCardsSummary = ({ cards, armyAssets, battleResults, isWinner, isUser }) => {
    const lastRound = battleResults[battleResults.length - 1];

    return (
        <Stack direction="row" mx="auto" w="45%" justifyContent="space-between" mt={2}>
            <Text fontSize="x-small" color="#FFF" fontFamily="Inter, system-ui" my="auto">
                {isUser ? 'MY' : 'OPPONENT'} CARDS:
            </Text>
            {armyAssets.map((asset, index) => {
                const card = cards.find(c => c.asset === asset);
                const isOverlayVisible =
                    isWinner || (lastRound.attackerAsset !== card.asset && lastRound.defenderAsset !== card.asset);

                return <CardWithOverlay key={index} card={card} isOverlayVisible={isOverlayVisible} />;
            })}
            <Image src={isWinner ? victoryIcon : defeatIcon} boxSize="50px" my="auto" />
        </Stack>
    );
};

export default BattleCardsSummary;
