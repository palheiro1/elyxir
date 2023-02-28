import { useState, forwardRef } from 'react';
import { Box, Button, Center, Heading, useBreakpointValue, useMediaQuery } from '@chakra-ui/react';
import HTMLFlipBook from 'react-pageflip';
import { pdfjs, Document, Page as ReactPdfPage } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import pdf from './Capitulo.pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Page = forwardRef(({ pageNumber, width }, ref) => {
    console.log('🚀 ~ file: Book.js:10 ~ Page ~ width:', width);

    return (
        <div ref={ref}>
            <ReactPdfPage pageNumber={pageNumber} width={width} />
        </div>
    );
});

const Book = () => {
    // ---------------------------------------------
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleNextPage = () => {
        if (pageNumber < numPages) setPageNumber(pageNumber + 1);
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };
    // ---------------------------------------------
    const width = useBreakpointValue({ base: 324, xl: 540 });
    const height = useBreakpointValue({ base: 763, xl: 763 });
    return (
        <Box>
            <Heading>Book</Heading>
            {isLargerThan800 && (
                <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                    <Center>
                        <HTMLFlipBook width={width} height={height}>
                            {Array.from(new Array(numPages), (el, index) => {
                                return <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width} />;
                            })}
                        </HTMLFlipBook>
                    </Center>
                </Document>
            )}

            {!isLargerThan800 && (
                <Box>
                    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                        <ReactPdfPage pageNumber={pageNumber} width={340} />
                    </Document>
                    <Button w="50%" onClick={handlePrevPage}>
                        Prev
                    </Button>
                    <Button w="50%" onClick={handleNextPage}>
                        Next
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Book;
