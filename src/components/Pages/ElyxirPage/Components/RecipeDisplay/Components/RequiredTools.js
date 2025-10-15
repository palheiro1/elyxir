import { Badge, Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

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
