import { Box, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SinglePost from './SinglePost';

const News = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            const response = await fetch(
                'https://api.rss2json.com/v1/api.json?rss_url=https://tarasca-dao.medium.com/feed'
            );
            const data = await response.json();
            // Only show the first 3 articles
            const items = data.items.slice(0, 3);
            setNews(items);
            setIsLoaded(true);
        };
        !isLoaded && fetchNews();
    }, [isLoaded]);

    const ToText = (node) => {
        let tag = document.createElement('div');
        tag.innerHTML = node;
        node = tag.innerText;
        return node;
    };

    return (
        <Box>
            <Text mb={4} fontSize="2xl">
                News
            </Text>
            <Stack direction="column">
                {isLoaded &&
                    news.map((item, index) => (
                        <SinglePost
                            key={index}
                            date={item.pubDate}
                            title={item.title}
                            text={ToText((item.description).substring(0, 1000) + '...')}
                            url={item.link}
                        />
                    ))}
            </Stack>
        </Box>
    );
};

export default News;

/*
<NewArticle
                    date="NOV 28, 2022"
                    title="Morphing creatures: updating Mythical Beings"
                    text="Step by step, our vision is making solid progress. In this update we are adding a new feature, Morphing, which also paves the way for the in-game economy, creating a first use and marketplace for ingame..."
                    url="https://tarasca-dao.medium.com/morphing-creatures-updating-mythical-beings-579c527840d"
                />
                */
