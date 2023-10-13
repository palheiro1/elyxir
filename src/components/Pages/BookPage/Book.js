import { useState, useEffect } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
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

    const colorHaveCard = 'rgba(65,59,151,1)';
    const colorNotHaveCard = 'rgba(65,59,151,0.5)';
    const borderColor = 'rgba(65,59,151,1)';

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
            <Text mb={2}>
                Once you have completed the collection, you can download the e-book to read on your favorite device.
            </Text>
            <Stack spacing={0} direction={{ base: 'column', xl: 'row' }} overflow="hidden">
                <Stack
                    direction="column"
                    spacing={0}
                    maxH={{ base: '15vh', xl: '73vh' }}
                    overflowY={'auto'}
                    minW="15%"
                    rounded={'md'}
                    style={{
                        scrollbarColor: '#312c71 #fff',
                        scrollbarWidth: 'thin',
                    }}>
                    <Box
                        bgColor={haveAllCards ? '#413b97' : 'rgba(65,59,151,0.35)'}
                        fontWeight="bolder"
                        color="white"
                        border="2px"
                        borderColor={borderColor}
                        onClick={haveAllCards ? downloadPDF : null}
                        _hover={{
                            cursor: haveAllCards ? 'pointer' : 'not-allowed',
                        }}
                        key={'all'}
                        rounded="sm"
                        p={2}
                        w="100%"
                        variant="outline">
                        DOWNLOAD BOOK
                    </Box>
                    {cards.map(card => {
                        const haveThisCard = card.quantityQNT > 0;
                        return (
                            <Box
                                color={'white'}
                                bgColor={haveThisCard ? colorHaveCard : colorNotHaveCard}
                                border="0px"
                                borderColor={borderColor}
                                onClick={() => (haveThisCard ? handleChangeCard(card) : null)}
                                _hover={{
                                    cursor: haveThisCard ? 'pointer' : 'not-allowed',
                                    bgColor: haveThisCard ? 'rgba(65,59,151,0.9)' : 'none',
                                }}
                                key={card.asset}
                                p={2}
                                w="100%"
                                variant="outline">
                                {card.name}
                            </Box>
                        );
                    })}
                </Stack>
                <Box
                    width="100%"
                    py="3"
                    border={'1px'}
                    borderColor="rgb(65,59,151)"
                    bgColor="rgba(65,59,151,0.15)"
                    rounded="md">
                    <PDFReader pdf={pdf} />
                </Box>
            </Stack>
        </Box>
    );
};

export default Book;
