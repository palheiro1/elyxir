import { useState, useEffect } from 'react';
import { Box, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import PDFReader from './PDFReader';
import MB_Book from './pdfs/MB_50_Book.pdf';

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

    const colorHaveCard = useColorModeValue('white', '');
    const colorNotHaveCard = useColorModeValue('blackAlpha.200', 'whiteAlpha.300');
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    let haveAllCards = false;
    haveAllCards = cards.every(card => {
        return (
            Number(card.quantityQNT) !== 0 &&
            (Number(card.quantityQNT) <= Number(card.unconfirmedQuantityQNT) ||
                Number(card.unconfirmedQuantityQNT) !== 0)
        );
    });

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = MB_Book;
        link.download = 'MB_Book.pdf';
        link.click();
    };

    return (
        <Box overflow="hidden">
            <Heading>Book</Heading>
            <Stack direction="row" spacing={0}>
                <Stack direction="column" spacing={0} maxH="73vh" overflowY={'auto'} minW="15%">
                    {haveAllCards && (
                        <Box
                            bgColor={'#F18800'}
                            fontWeight="bolder"
                            color="white"
                            border="1px"
                            borderColor={borderColor}
                            onClick={downloadPDF}
                            _hover={{
                                cursor: 'pointer',
                            }}
                            key={'all'}
                            rounded="sm"
                            p={2}
                            w="100%"
                            variant="outline">
                            DOWNLOAD BOOK
                        </Box>
                    )}
                    {cards.map(card => {
                        const haveThisCard = card.quantityQNT > 0;
                        return (
                            <Box
                                bgColor={haveThisCard ? colorHaveCard : colorNotHaveCard}
                                border="1px"
                                borderColor={borderColor}
                                onClick={() => (haveThisCard ? handleChangeCard(card) : null)}
                                _hover={{
                                    cursor: haveThisCard ? 'pointer' : 'not-allowed',
                                    bgColor: haveThisCard ? '#F18800' : 'none',
                                }}
                                key={card.asset}
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
