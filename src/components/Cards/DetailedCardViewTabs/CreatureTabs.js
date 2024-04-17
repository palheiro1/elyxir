import { Box, Center, Image, TabPanel, Text } from '@chakra-ui/react';

const CreatureTabs = ({ monster, name }) => {
    const monsterPicture = 'https://media.mythicalbeings.io/creatures/' + monster.picture;

    return (
        <TabPanel>
            <Center mb={4}>
                <Box maxW={{ base: '90%', lg: '50%' }}>
                    <Image src={monsterPicture} alt={name} rounded="lg" align="center" />
                </Box>
            </Center>
            {monster.creature.map((c, i) => (
                <Text key={i} fontSize="md" color="gray" textAlign="justify" mb={4}>
                    {c}
                </Text>
            ))}
        </TabPanel>
    );
};

export default CreatureTabs;
