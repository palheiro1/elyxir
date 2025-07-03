import { Text, Image, Stack } from '@chakra-ui/react';

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
