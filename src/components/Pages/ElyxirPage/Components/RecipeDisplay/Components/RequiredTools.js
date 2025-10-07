import { Badge, Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { RECIPES } from '../../../data';

const RequiredTools = ({ selectedRecipeIdx, groupedItems }) => {
    return (
        <Box>
            <Text fontWeight="bold" fontSize="lg" mb={4}>
                Required Tools:
            </Text>
            <Wrap spacing={6}>
                {RECIPES[selectedRecipeIdx].tools.map((toolName, i) => {
                    const tool = groupedItems.tools?.find(item => item.name.toLowerCase() === toolName.toLowerCase());
                    const hasTool = !!tool;

                    return (
                        <WrapItem key={i}>
                            <Box
                                p={4}
                                border="2px"
                                borderColor={hasTool ? 'green.300' : 'red.300'}
                                borderRadius="md"
                                textAlign="center"
                                w="140px">
                                {tool && (
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
                                )}
                                <Text fontSize="sm" fontWeight="bold" mb={1}>
                                    {toolName}
                                </Text>
                                <Badge colorScheme={hasTool ? 'green' : 'red'} fontSize="xs">
                                    {hasTool ? 'Available' : 'Missing'}
                                </Badge>
                            </Box>
                        </WrapItem>
                    );
                })}
            </Wrap>
        </Box>
    );
};

export default RequiredTools;
