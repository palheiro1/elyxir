import {
    Box,
    Center,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Hover from 'react-3d-hover';
import { RARITY_COLORS } from '../../data/CONSTANTS';

import monsters from '../../data/monsters.json';

function Iframe({ iframe }) {
    return (
        <Box
            dangerouslySetInnerHTML={{
                __html: iframe ? iframe : '',
            }}
        />
    );
}

/**
 * @name DetailedCard
 * @description Modal to show the details of a card
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {Object} data - Object with the card data
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const DetailedCard = ({ isOpen, onClose, data }) => {
    const { name, cardImgUrl: image, assetname } = data;

    // ------------------------------------------------------------
    const monster = monsters.find(m => m.assetname === assetname);
    const monsterPicture = 'https://media.mythicalbeings.io/creatures/' + monster.picture;
    const monsterLandscape = 'https://media.mythicalbeings.io/landscapes/' + monster.landscape;
    const imgMapURL = 'https://media.mythicalbeings.io/maps/Map_' + monster.name + '.jpg';
    const MapIframe = monster.maplink;

    const textColor = useColorModeValue('gray.200', 'gray.200');
    const badgeColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.300');

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered="true">
                <ModalOverlay bgColor="blackAlpha.900" />
                <ModalContent
                    p={2}
                    px={12}
                    bgColor="#1D1D1D"
                    shadow="dark-lg"
                    border="1px"
                    borderColor="whiteAlpha.400">
                    <Stack direction="row">
                        <Box mt="6%">
                            <Hover perspective={300}>
                                <Image src={image} alt={name} maxH="40rem" rounded="lg" />
                            </Hover>
                        </Box>

                        <Stack direction="column" align="center" w="100%">
                            <ModalBody color={textColor} w="100%">
                                <Text color="white" fontSize="4xl" fontWeight="bolder">
                                    {monster.name}
                                </Text>

                                <Stack direction="row" mb={2}>
                                    <Center>
                                        <Image src="images/cards/rarity.png" alt="rarity" maxH="3rem" align="center" />
                                    </Center>
                                    <Stack direction="column" spacing={0}>
                                        <Text fontSize="md" color="gray">
                                            Rarity
                                        </Text>
                                        <Text
                                            fontSize="md"
                                            bgGradient={RARITY_COLORS[monster.rarity]}
                                            rounded="lg"
                                            color="black"
                                            px={2}>
                                            {monster.rarity}
                                        </Text>
                                    </Stack>

                                    <Center>
                                        <Image
                                            src="images/cards/continent.png"
                                            alt="continent"
                                            maxH="3rem"
                                            align="center"
                                        />
                                    </Center>
                                    <Stack direction="column" spacing={0}>
                                        <Text fontSize="md" color="gray">
                                            Continent
                                        </Text>
                                        <Text fontSize="md" bgColor={badgeColor} rounded="lg" color="white" px={2}>
                                            {monster.continent}
                                        </Text>
                                    </Stack>
                                </Stack>

                                <Tabs isFitted variant="line">
                                    <TabList>
                                        <Tab _selected={{ borderColor: '#F18800' }}>Creature</Tab>
                                        <Tab _selected={{ borderColor: '#F18800' }}>Culture</Tab>
                                        <Tab _selected={{ borderColor: '#F18800' }}>Location</Tab>
                                    </TabList>
                                    <TabPanels overflowY="auto" maxH="27.5rem">
                                        <TabPanel>
                                            <Center mb={4}>
                                                <Box maxW="50%">
                                                    <Image
                                                        src={monsterPicture}
                                                        alt={name}
                                                        rounded="lg"
                                                        align="center"
                                                    />
                                                </Box>
                                            </Center>
                                            {monster.creature.map((c, i) => (
                                                <Text key={i} fontSize="md" color="gray" textAlign="justify" mb={4}>
                                                    {c}
                                                </Text>
                                            ))}

                                            <Center my={4}>
                                                <Image
                                                    src={monsterLandscape}
                                                    alt={name}
                                                    maxH="30rem"
                                                    rounded="lg"
                                                    align="center"
                                                />
                                            </Center>
                                        </TabPanel>
                                        <TabPanel>
                                            {monster.culture.map((c, i) => (
                                                <Text key={i} fontSize="md" color="gray" textAlign="justify" mb={4}>
                                                    {c}
                                                </Text>
                                            ))}

                                            <Center my={4}>
                                                <Image
                                                    src={
                                                        imgMapURL ===
                                                        'https://media.mythicalbeings.io/maps/Map_/Kaggen.jpg'
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
                                        <TabPanel>
                                            <Center w="100%">
                                                <Iframe iframe={MapIframe} />
                                            </Center>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </ModalBody>
                        </Stack>
                    </Stack>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DetailedCard;