import { Box, Heading, Divider } from '@chakra-ui/react';
import News from './News/News';

const NewsAirdrops = () => {
  return (
    <Box p={4}>
      <Heading size="md" mb={4}>News & Airdrops</Heading>
      <News />
      {/* Placeholder for future airdrop announcements */}
      <Divider my={6} />
      <Heading size="sm" mb={2}>Airdrops</Heading>
      <Box color="gray.400" fontSize="sm">No airdrops at this time. Stay tuned!</Box>
    </Box>
  );
};

export default NewsAirdrops;
