import { Text } from "@chakra-ui/react";

const Warning = ({ textColor }) => {
    return (
        <Text fontSize="xs" color={textColor} textAlign="center" mt={2}>
            Want to trade your cards or currencies for wETH, MATIC or DAI?
            <br /> Send them to Polygon via Bridge, and use the marketplaces{' '}
            <a href="https://polygon.mythicalbeings.io" target="_blank" rel="noreferrer">
                polygon.mythicalbeings.io
            </a>
            ,{' '}
            <a href="https://opensea.io/collection/beings-mythical" target="_blank" rel="noreferrer">
                Opensea
            </a>{' '}
            or{' '}
            <a href="https://rarible.com/mythicalbeings/" target="_blank" rel="noreferrer">
                Rarible
            </a>
            .
        </Text>
    );
};

export default Warning;