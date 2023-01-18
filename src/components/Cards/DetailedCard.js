import {
    Box,
    Center,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Hover from 'react-3d-hover';
import { GiSeaCreature } from 'react-icons/gi';
import { MdLandscape } from 'react-icons/md';

import monsters from '../../data/monsters.json';

function Iframe(props) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: props.iframe ? props.iframe : "",
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
    console.log(monster);
    const monsterPicture = 'https://media.mythicalbeings.io/creatures/' + monster.picture;
    const monsterLandscape = 'https://media.mythicalbeings.io/landscapes/' + monster.landscape;
    const imgMapURL = 'https://media.mythicalbeings.io/maps/Map_' + monster.name + '.jpg';

    const textColor = useColorModeValue('gray.200', 'gray.200');

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay />
                <ModalContent p={12} backgroundColor="blackAlpha.900" shadow="dark-lg">
                    <Stack direction="row">
                        <Box position="fixed" top="15%">
                            <Hover perspective={300}>
                                <Image src={image} alt={name} maxH="40rem" rounded="lg" />
                            </Hover>
                        </Box>

                        <Box w="35%" />

                        <Stack direction="column" align="center" w="100%">
                            <ModalHeader>
                                <Text color="white" fontSize="4xl" fontWeight="bolder" my={-4}>
                                    {name}
                                </Text>
                            </ModalHeader>
                            <ModalCloseButton />

                            <ModalBody color={textColor} w="100%">
                                <Center mb={4}>
                                    <Image src={monsterPicture} alt={name} maxH="15rem" rounded="lg" align="center" />
                                </Center>

                                <Text fontSize="md" color="gray" textAlign="center">
                                    {monster.continent} / {monster.country} / {monster.name}
                                </Text>

                                <Heading textAlign="center" my={4}>
                                    <Center>
                                        Creature <GiSeaCreature />
                                    </Center>
                                </Heading>

                                {monster.creature.map((c, i) => (
                                    <Text key={i} fontSize="md" color="gray" textAlign="justify">
                                        {c}
                                    </Text>
                                ))}

                                <Center my={4}>
                                    <Image src={monsterLandscape} alt={name} maxH="15rem" rounded="lg" align="center" />
                                </Center>

                                <Heading textAlign="center" my={4}>
                                    <Center>
                                        Culture <MdLandscape />
                                    </Center>
                                </Heading>

                                {monster.culture.map((c, i) => (
                                    <Text key={i} fontSize="md" color="gray" textAlign="justify">
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
                                        maxH="15rem"
                                        rounded="lg"
                                        align="center"
                                    />
                                </Center>
                            </ModalBody>
                        </Stack>
                    </Stack>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DetailedCard;
