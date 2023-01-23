import { useEffect, useState } from 'react';
import { Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { Animated } from 'react-animated-css';

import Card from './Card';
import DetailedCard from './DetailedCard';


/**
 * @name GridCards
 * @description GridCards component - Shows the cards in a grid
 * @param {Array} cards - Array with the cards
 * @param {Boolean} isMarket - Boolean to know if the cards are in the market
 * @param {Boolean} onlyBuy - Boolean to know if the cards are only buyable
 * @param {String} username - String with the username
 * @param {Object} ignis - Object with the ignis data
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const GridCards = ({ cards, isMarket = false, onlyBuy = false, username, ignis }) => {
	const [actualCards, setActualCards] = useState(cards);

	// Card clicked
	const [cardClicked, setCardClicked] = useState();

	// Open DetailedCardView
	const { isOpen, onOpen, onClose } = useDisclosure();

	// State to keep track of the cards that have been loaded
	const [loadedCards, setLoadedCards] = useState([]);

	// State to keep track of if there are more cards to load
	const [hasMoreCards, setHasMoreCards] = useState(true);

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
				// Load more cards
				loadMoreCards();
			}
		};

		// Function to load more cards
		const loadMoreCards = () => {
			// Check if there are more cards to load and if we are not already loading
			if (hasMoreCards && !isLoading) {
				setIsLoading(true);
				// Get the next batch of cards
				const nextCards = actualCards.slice(loadedCards.length, loadedCards.length + 10);
				// Check if there are no more cards to load
				if (nextCards.length === 0) {
					setHasMoreCards(false);
				}

				// Add the new cards to the loaded cards
				setLoadedCards([...loadedCards, ...nextCards]);
				setIsLoading(false);
			}
		};

		if (isFirstTime) {
			setIsFirstTime(false);
			// Load the first batch of cards
			loadMoreCards();
		}

		if (JSON.stringify(cards) !== JSON.stringify(actualCards)) {
			setActualCards(cards);
			setLoadedCards([]);
			setHasMoreCards(true);
			setIsFirstTime(true);
		}

		// Add event listener for scroll event
		window.addEventListener('scroll', handleScroll);
		return () => {
			// Remove event listener on cleanup
			window.removeEventListener('scroll', handleScroll);
		};
	}, [cards, actualCards, hasMoreCards, isLoading, loadedCards, isFirstTime]);

    const cardsDelay = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

	return (
		<>
			<Grid
				templateColumns={[
					'repeat(1, 1fr)',
					'repeat(1, 1fr)',
					'repeat(2, 1fr)',
					'repeat(3, 3fr)',
					'repeat(5, 1fr)',
				]}
				gap={4}
				my={4}>
				{loadedCards.map((card, index) => {
                    const delay = cardsDelay[index%10];
					return (
						<Animated
							key={index}
							animationIn="fadeIn"
							animationOut="fadeOut"
							isVisible={true}
							animationInDelay={delay}>
							<GridItem key={index}>
								<Card
									username={username}
									card={card}
									setCardClicked={setCardClicked}
									onOpen={onOpen}
									isMarket={isMarket}
									onlyBuy={onlyBuy}
									ignis={ignis}
								/>
							</GridItem>
						</Animated>
					);
				})}
			</Grid>
			{isLoading && <p>Loading...</p>}
			{isOpen && <DetailedCard isOpen={isOpen} onClose={onClose} data={cardClicked} />}
		</>
	);
};

export default GridCards;
