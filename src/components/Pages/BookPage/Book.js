import React from 'react';
import { Heading } from '@chakra-ui/react';
import HTMLFlipBook from 'react-pageflip';
import { pdfjs, Document, Page as ReactPdfPage } from 'react-pdf';

import pdf from './Capitulo.pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const width = 540;
const height = 763;

const Page = React.forwardRef(({ pageNumber }, ref) => {
    return (
        <div ref={ref}>
            <ReactPdfPage pageNumber={pageNumber} width={width} />
        </div>
    );
});

const Book = () => {
    return (
        <>
            <Heading>Book</Heading>
            <Document file={pdf}>
                <HTMLFlipBook width={width} height={height}>
                    <Page pageNumber={1} />
                    <Page pageNumber={2} />
                    <Page pageNumber={3} />
                    <Page pageNumber={4} />
                </HTMLFlipBook>
            </Document>
        </>
    );
};

export default Book;
