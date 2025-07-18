import { Box, GridItem, Image, Text, Tooltip } from '@chakra-ui/react';

/**
 * @name CapturedCardCell
 * @description Displays a captured card inside a styled `GridItem` cell. Includes a tooltip that shows
 * a larger image of the card when hovered. The text and image styling adapts to mobile screens.
 * @param {Object} props - Component props.
 * @param {Object} props.card - Card data object containing `name` and `cardImgUrl`.
 * @param {boolean} props.isMobile - Flag indicating whether the component is viewed on a mobile device.
 * @returns {JSX.Element} A Chakra UI `GridItem` displaying the card name with tooltip on hover.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CapturedCardCell = ({ card, isMobile }) => (
    <GridItem colSpan={1} textAlign="center">
        <Box>
            <Tooltip
                label={
                    <Box>
                        <Image src={card?.cardImgUrl} alt={card?.name} w="200px" />
                    </Box>
                }
                aria-label={card?.name}
                placement="top"
                hasArrow>
                <Box
                    p={3}
                    fontFamily="Inter, System"
                    fontWeight={700}
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    maxH="45px"
                    fontSize={isMobile ? 'xs' : 'md'}>
                    <Text
                        border="2px solid #C1A34C"
                        borderRadius="20px"
                        w="150px"
                        p={3}
                        maxH="45px"
                        fontFamily="Inter, System"
                        color="#C1A34C"
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {card?.name}
                    </Text>
                </Box>
            </Tooltip>
        </Box>
    </GridItem>
);

export default CapturedCardCell;
