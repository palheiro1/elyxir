import { useState, useEffect } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import PDFReader from './PDFReader';

const Book = ({ cards }) => {
    const [currentCard, setCurrentCard] = useState(cards[0]);
    // PDF route
    const routeFiles = './pdfs/';
    const [pdf, setPdf] = useState(null);

    const handleChangeCard = card => {
        const cardIndex = cards.findIndex(cardAc => cardAc.assetname === card.assetname);
        setCurrentCard(cards[cardIndex]);
    };

    useEffect(() => {
        const loadPdf = async () => {
            const route = currentCard ? routeFiles + currentCard.assetname + '.pdf' : null;
            const auxPdf = await import(`${route}`);
            setPdf(auxPdf.default);
        };
        loadPdf();
    }, [currentCard]);

    return (
        <Box overflow="hidden">
            <Heading>Book</Heading>
            <Stack direction="row" spacing={0}>
                <Stack direction="column" spacing={0} maxH="75vh" overflowY={'auto'} minW="12rem">
                    {cards.map(card => {
                        const haveThisCard = card.quantityQNT > 0;
                        return (
                            <Box
                                bgColor={haveThisCard ? 'white' : 'blackAlpha.200'}
                                onClick={() => (haveThisCard ? handleChangeCard(card) : null)}
                                _hover={{ cursor: haveThisCard ? 'pointer' : 'not-allowed' }}
                                key={card.asset}
                                border="1px"
                                rounded="sm"
                                p={2}
                                w="100%"
                                variant="outline">
                                {card.name}
                            </Box>
                        );
                    })}
                </Stack>
                <Box width="100%">
                    <PDFReader pdf={pdf} />
                </Box>
            </Stack>
        </Box>
    );
};

export default Book;
