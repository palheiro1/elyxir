import { Center, Image, TabPanel, Text } from '@chakra-ui/react';

const CultureTabs = ({ monster, name }) => {
    const monsterLandscape = 'https://media.mythicalbeings.io/landscapes/' + monster.landscape;
    const imgMapURL = 'https://media.mythicalbeings.io/maps/Map_' + monster.name + '.jpg';

    return (
        <TabPanel>
            <Center my={4}>
                <Image src={monsterLandscape} alt={name} maxH="30rem" rounded="lg" align="center" />
            </Center>
            {monster.culture.map((c, i) => (
                <Text key={i} fontSize="md" color="gray" textAlign="justify" mb={4}>
                    {c}
                </Text>
            ))}

            <Center my={4}>
                <Image
                    src={
                        imgMapURL === 'https://media.mythicalbeings.io/maps/Map_/Kaggen.jpg'
                            ? 'https://media.mythicalbeings.io/maps/Map_Mantis.jpg'
                            : imgMapURL
                    }
                    alt={name}
                    maxH="30rem"
                    rounded="lg"
                    align="center"
                />
            </Center>
        </TabPanel>
    );
};

export default CultureTabs;
