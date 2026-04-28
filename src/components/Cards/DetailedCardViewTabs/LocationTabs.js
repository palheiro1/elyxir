import { Box, Center, TabPanel } from '@chakra-ui/react';

function getGoogleMapsEmbedSrc(iframe = '') {
    const match = iframe.match(/\bsrc=(['"])(.*?)\1/i);
    if (!match) return null;

    try {
        const url = new URL(match[2]);
        const isGoogleMapsEmbed = url.protocol === 'https:' && url.hostname === 'www.google.com' && url.pathname.startsWith('/maps/embed');
        return isGoogleMapsEmbed ? url.toString() : null;
    } catch (error) {
        return null;
    }
}

const LocationTabs = ({ monster }) => {
    const mapSrc = getGoogleMapsEmbedSrc(monster.maplink);

    return (
        <TabPanel>
            <Center w="100%">
                {mapSrc && (
                    <Box
                        as="iframe"
                        src={mapSrc}
                        title={`${monster.name || 'Monster'} location`}
                        width="600px"
                        height="400px"
                        border="0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                )}
            </Center>
        </TabPanel>
    );
};

export default LocationTabs;
