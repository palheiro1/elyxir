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
const QuickStartStep = ({ title, imageSrc, texts }) => (
    <Stack direction={'column'} spacing={4} overflow={'hidden'}>
        <Text fontSize="42px">{title}</Text>
        <Image src={imageSrc} w={title === 'Fight and win' ? '45%' : '70%'} mx="auto" />
        {texts.map((text, index) => (
            <Text key={index} fontSize={index === 0 ? '26px' : 'md'} fontFamily={index === 0 ? undefined : 'Inter'}>
                {text}
            </Text>
        ))}
    </Stack>
);

export default QuickStartStep;
