import { useEffect, useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { Animated } from 'react-animated-css';

import ItemCard from './ItemCard';
import DetailedItem from './DetailedItem';

/**
 * @name GridItems
 * @description GridItems component - Shows the items in a grid
 * @param {Array} items - Array with the items
 * @param {Boolean} isMarket - Boolean to know if the items are in the market
 * @param {Boolean} onlyBuy - Boolean to know if the items are only buyable
 * @param {Object} infoAccount - Object with the info of the account
 * @param {String} market - String with the market
 * @param {String} rgbColor - String with the RGB color
 * @returns {JSX.Element} - JSX element
 */
const GridItems = ({
    items,
    isMarket = false,
    onlyBuy = false,
    infoAccount = {},
    market = 'IGNIS',
    rgbColor = '59, 100, 151',
}) => {
    const [actualItems, setActualItems] = useState(items);

    // Item clicked
    const [itemClicked, setItemClicked] = useState();

    // Open DetailedItemView
    const { isOpen, onOpen, onClose } = useDisclosure();

    // State to keep track of the items that have been loaded
    const [loadedItems, setLoadedItems] = useState([]);

    // State to keep track of if there are more items to load
    const [hasMoreItems, setHasMoreItems] = useState(true);

    // State to keep track of the loading status
    const [isLoading, setIsLoading] = useState(false);

    // State to keep track of the first time
    const [isFirstTime, setIsFirstTime] = useState(true);

    useEffect(() => {
        // Function to handle scroll event
        const handleScroll = () => {
            // Get the current scroll position
            const scrollY = window.scrollY;
            // Get the height of the document
            const docHeight = document.body.offsetHeight;
            // Get the window height
            const windowHeight = window.innerHeight;
            // Check if the user has scrolled to the bottom of the page
            if (scrollY + windowHeight >= docHeight - 100) {
                // Load more items
                loadMoreItems();
            }
        };

        // Function to load more items
        const loadMoreItems = () => {
            // Check if there are more items to load and if we are not already loading
            if (hasMoreItems && !isLoading) {
                setIsLoading(true);
                // Get the next batch of items
                const nextItems = actualItems.slice(loadedItems.length, loadedItems.length + 10);
                // Check if there are no more items to load
                if (nextItems.length === 0) {
                    setHasMoreItems(false);
                }

                // Add the new items to the loaded items
                setLoadedItems([...loadedItems, ...nextItems]);
                setIsLoading(false);
            }
        };

        if (isFirstTime) {
            setIsFirstTime(false);
            // Load the first batch of items
            loadMoreItems();
        }

        if (JSON.stringify(items) !== JSON.stringify(actualItems)) {
            setActualItems(items);
            setLoadedItems([]);
            setHasMoreItems(true);
            setIsFirstTime(true);
        }

        // Add event listener for scroll event
        window.addEventListener('scroll', handleScroll);
        return () => {
            // Remove event listener on cleanup
            window.removeEventListener('scroll', handleScroll);
        };
    }, [items, actualItems, hasMoreItems, isLoading, loadedItems, isFirstTime]);

    const itemsDelay = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    return (
        <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4, '2xl': 5 }} my={4} gap={{ base: 1, md: 4 }}>
                {loadedItems.map((item, index) => {
                    const delay = itemsDelay[index % 10];
                    return (
                        <Animated
                            key={index}
                            animationIn="fadeIn"
                            animationOut="fadeOut"
                            isVisible={true}
                            animationInDelay={delay}>
                            <ItemCard
                                item={item}
                                setItemClicked={setItemClicked}
                                onOpen={onOpen}
                                isMarket={isMarket}
                                onlyBuy={onlyBuy}
                                infoAccount={infoAccount}
                                market={market}
                                rgbColor={rgbColor}
                            />
                        </Animated>
                    );
                })}
            </SimpleGrid>
            {isLoading && <p>Loading...</p>}
            {isOpen && <DetailedItem isOpen={isOpen} onClose={onClose} data={itemClicked} />}
        </>
    );
};

export default GridItems;
