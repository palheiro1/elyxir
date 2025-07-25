import { GridItem, Text } from '@chakra-ui/react';
import ResponsiveTooltip from '../../../ui/ReponsiveTooltip';
import { InfoOutlineIcon } from '@chakra-ui/icons';

/**
 * @name ColumnLabel
 * @description Component that renders a column header label inside a `GridItem`.
 * It adjusts the font size based on screen size and centers the text.
 * @param {Object} props - Component props.
 * @param {string} props.label - Text to be displayed as the column label.
 * @param {boolean} props.isMobile - Determines whether to use small or medium font size.
 * @returns {JSX.Element} A styled Chakra UI `GridItem` containing the label text.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ColumnLabel = ({ label, isMobile, info = null, ...rest }) => (
    <GridItem
        colSpan={1}
        textAlign="center"
        my="auto"
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={info ? 'space-between' : 'center'}
        // mx={info && 3}
    >
        <Text fontFamily="Inter, System" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'} {...rest}>
            {label}
        </Text>
        {info && (
            <ResponsiveTooltip label={info} ml="1">
                <span>
                    <InfoOutlineIcon cursor="pointer" color={'#C3C3C3'} />
                </span>
            </ResponsiveTooltip>
        )}
    </GridItem>
);

export default ColumnLabel;
