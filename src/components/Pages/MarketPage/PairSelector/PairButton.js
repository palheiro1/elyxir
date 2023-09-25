import { Button } from "@chakra-ui/react";

const PairButton = ({ text, value, marketCurrency, setMarketCurrency, textColor }) => {
    return (
        <Button
            borderColor="#3b6497"
            size="sm"
            variant="outline"
            color={textColor}
            _active={{ bgColor: '#3b6497', color: 'white' }}
            isActive={marketCurrency === value}
            onClick={() => setMarketCurrency(value)}
            _hover={{ bgColor: 'rgba(59,100,151,0.59)', color: "white" }}>
            {text}
        </Button>
    );
};

export default PairButton;