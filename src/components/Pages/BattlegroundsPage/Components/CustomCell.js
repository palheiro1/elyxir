import { GridItem, Text } from '@chakra-ui/react';

/**
 * @name CustomCell
 * @description Displays a value inside a styled Chakra UI `GridItem` cell, typically used to show earnings
 * or numeric/textual values in a table row. The component adjusts font size for mobile
 * and allows optional uppercase formatting.
 * @param {Object} props - Component props.
 * @param {string|number} props.value - The content to display inside the cell.
 * @param {boolean} props.isMobile - Flag to determine if the layout is mobile-optimized.
 * @param {boolean} [props.isUppercase=false] - Whether to transform the text to uppercase.
 * @returns {JSX.Element} A styled Chakra UI `GridItem` with centered content.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CustomCell = ({ value, isMobile, isUppercase = false, padding = 3, children = null, ...rest }) => (
    <GridItem colSpan={1} textAlign="center">
        <Text
            p={padding}
            maxH="45px"
            fontFamily="Inter, System"
            fontWeight={700}
            h="100%"
            fontSize={isMobile ? 'xs' : 'md'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            textTransform={isUppercase ? 'uppercase' : 'none'}
            {...rest}>
            {children || value}
        </Text>
    </GridItem>
);

export default CustomCell;
