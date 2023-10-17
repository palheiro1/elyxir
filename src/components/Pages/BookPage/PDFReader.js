import { useState, forwardRef, useRef } from 'react';
import {
    Box,
    Center,
    Image,
    Stack,
    useBreakpointValue,
    useMediaQuery,
} from '@chakra-ui/react';
import HTMLFlipBook from 'react-pageflip';
import { pdfjs, Document, Page as ReactPdfPage } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Page = forwardRef(({ pageNumber, width }, ref) => {
    return (
        <div ref={ref}>
            <ReactPdfPage pageNumber={pageNumber} width={width} />
        </div>
    );
});

const PDFReader = ({ pdf }) => {
    // ---------------------------------------------
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

    const pageFlipRef = useRef(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // ---------------------------------------------
    const handleFlipNext = () => {
        if (pageFlipRef.current) {
            pageFlipRef.current.pageFlip().flipNext();
        }
    };

    const handleFlipPrev = () => {
        if (pageFlipRef.current) {
            pageFlipRef.current.pageFlip().flipPrev(); // Avanzar a la página siguiente
        }
    };

    // ---------------------------------------------
    const handleNextPage = () => {
        if (pageNumber < numPages) setPageNumber(pageNumber + 1);
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };
    // ---------------------------------------------
    const width = useBreakpointValue({ base: 324, xl: 540 });
    const height = useBreakpointValue({ base: 763, xl: 680 });

    return (
        <Box>
            {isLargerThan800 && (
                <Stack>
                    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                        <Center>
                            <HTMLFlipBook width={width} height={height} ref={pageFlipRef} maxShadowOpacity={0}>
                                {Array.from(new Array(numPages), (el, index) => {
                                    return <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width} />;
                                })}
                            </HTMLFlipBook>
                        </Center>
                    </Document>
                    <Center gap={1}>
                        <Image
                            src="/images/book/left.png"
                            maxW="5rem"
                            onClick={handleFlipPrev}
                            cursor={'pointer'}
                            _hover={{ filter: 'brightness(1.3)' }}
                        />
                        <Image
                            src="/images/book/right.png"
                            maxW="5rem"
                            onClick={handleFlipNext}
                            cursor={'pointer'}
                            _hover={{ filter: 'brightness(1.3)' }}
                        />
                    </Center>
                </Stack>
            )}

            {!isLargerThan800 && (
                <Box>
                    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                        <ReactPdfPage pageNumber={pageNumber} width={340} />
                    </Document>
                    <Center gap={1} mt={2}>
                        <Image
                            src="/images/book/left.png"
                            maxW="5rem"
                            onClick={handlePrevPage}
                            cursor={'pointer'}
                            _hover={{ filter: 'invert(1)' }}
                        />
                        <Image
                            src="/images/book/right.png"
                            maxW="5rem"
                            onClick={handleNextPage}
                            cursor={'pointer'}
                            _hover={{ filter: 'invert(1)' }}
                        />
                    </Center>
                </Box>
            )}
        </Box>
    );
};

export default PDFReader;
