import { Text, Image, Stack } from '@chakra-ui/react';

/**
 * @name QuickStartStep
 * @description Presentational component that displays a single tutorial step in the Quick Start guide.
 * Shows a title, an image, and a list of explanatory texts styled with different font sizes.
 * @param {string} title - The title of the step.
 * @param {string} imageSrc - URL or path of the image to display for the step.
 * @param {string[]} texts - Array of text strings explaining the step; the first text is styled larger.
 * @returns {JSX.Element} A vertical stack with the step's title, image, and description texts.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const QuickStartStep = ({ title, imageSrc, texts, setImagesLoaded, isMobile }) => {
    const imageWidth = title === 'Fight and win' ? (isMobile ? '30%' : '90%') : isMobile ? '35%' : '80%';
    return (
        <Stack direction="column" spacing={4} overflow="hidden" align="center">
            <Stack direction={!isMobile ? 'column' : 'row-reverse'}>
                <Text fontSize={isMobile ? '32px' : '42px'} my={isMobile && 'auto'}>
                    {title}
                </Text>
                <Image
                    key={imageSrc}
                    src={imageSrc}
                    mx="auto"
                    w={imageWidth}
                    onLoad={() => setImagesLoaded(true)}
                    onError={() => setImagesLoaded(true)}
                />
            </Stack>
            {texts.map((text, index) => (
                <Text key={index} fontSize={index === 0 ? '26px' : 'md'} fontFamily={index === 0 ? undefined : 'Inter'}>
                    {text}
                </Text>
            ))}
        </Stack>
    );
};

export default QuickStartStep;
