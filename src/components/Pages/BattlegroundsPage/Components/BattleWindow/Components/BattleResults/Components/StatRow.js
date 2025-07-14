import { Image, Stack, Text } from '@chakra-ui/react';

/**
 * @name StatRow
 * @description Displays a horizontal row containing an icon and a text value, typically used to represent a stat or attribute.
 * @param {string} icon - The URL or import path of the icon image to display.
 * @param {string|number} value - The text or numeric value associated with the stat.
 * @returns {JSX.Element} A horizontal stack with an icon and its corresponding value.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const StatRow = ({ icon, value }) => (
    <Stack direction="row">
        <Image boxSize="20px" borderRadius="5px" p={0.5} bgColor="#FFF" src={icon} />
        <Text>{value}</Text>
    </Stack>
);

export default StatRow;
