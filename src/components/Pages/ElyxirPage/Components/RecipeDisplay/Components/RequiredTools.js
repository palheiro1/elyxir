import { Badge, Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

/**
 * @name RequiredTools
 * @description Displays the list of tools required to craft the selected recipe, showing availability status and corresponding visuals.
 * Each tool card indicates whether the user possesses the required tool, including its name, image, and available quantity.
 * @param {Object} selectedRecipe - The currently selected recipe containing an array of required tool asset IDs.
 * @returns {JSX.Element} A grid of tool cards showing tool details and availability indicators for each required tool in the recipe.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const RequiredTools = ({ selectedRecipe }) => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const { tools } = fakeAssets;
    return (
        <Box>
            <Text fontWeight="bold" fontSize="lg" mb={4}>
                Required Tools:
            </Text>
            <Wrap spacing={6}>
                {selectedRecipe.tools.map((asset, i) => {
                    const tool = tools?.find(item => item.asset === asset);

                    const qty = Number(tool?.quantityQNT ?? 0);
                    const hasTool = !!tool && qty > 0;

                    return (
                        <WrapItem key={i}>
                            <Box
                                p={4}
                                border="2px"
                                borderColor={hasTool ? 'green.300' : 'red.300'}
                                borderRadius="md"
                                textAlign="center"
                                w="140px">
                                {tool ? (
                                    <>
                                        <Box
                                            w="60px"
                                            h="60px"
                                            backgroundImage={`url(${tool.imgUrl})`}
                                            backgroundSize="contain"
                                            backgroundRepeat="no-repeat"
                                            backgroundPosition="center"
                                            mx="auto"
                                            mb={2}
                                        />
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>
                                            {tool.name}
                                        </Text>
                                        <Badge colorScheme={hasTool ? 'green' : 'red'} fontSize="xs">
                                            {hasTool ? 'Available' : 'Missing'}
                                        </Badge>
                                        <Text fontSize="xs" color="gray.600">
                                            ({qty} available)
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text fontSize="sm" fontWeight="bold" mb={2}>
                                            Unknown tool
                                        </Text>
                                        <Badge colorScheme="red" fontSize="xs">
                                            Missing
                                        </Badge>
                                    </>
                                )}
                            </Box>
                        </WrapItem>
                    );
                })}
            </Wrap>
        </Box>
    );
};

export default RequiredTools;
