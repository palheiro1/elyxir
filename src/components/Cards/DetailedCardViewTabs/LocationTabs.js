import { Box, Center, TabPanel } from '@chakra-ui/react';

function Iframe({ iframe }) {
    return (
        <Box
            dangerouslySetInnerHTML={{
                __html: iframe ? iframe : '',
            }}
        />
    );
}

const LocationTabs = ({ monster }) => {
    const MapIframe = monster.maplink;

    return (
        <TabPanel>
            <Center w="100%">
                <Iframe iframe={MapIframe} />
            </Center>
        </TabPanel>
    );
};

export default LocationTabs;
