import { ChakraProvider } from '@chakra-ui/react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import CraftingConfirmation from './Modals/CraftingConfirmation';
import RecipeSelector from './RecipeSelector';
import {
    ELYXIR_LIFECYCLE_FIX_HEIGHT,
    NEW_LIFECYCLE_CREATED_COPY,
    RECIPE_REQUIREMENT_COPY,
} from '../../../../utils/elyxirLifecycle';

jest.mock('@chakra-ui/react', () => {
    const React = require('react');
    const Component =
        (tag = 'div') =>
        ({ children }) =>
            React.createElement(tag, null, children);

    return {
        Alert: Component(),
        AlertDescription: Component(),
        AlertIcon: Component('span'),
        AlertTitle: Component(),
        Badge: Component('span'),
        Box: Component(),
        Button: ({ children, onClick }) => React.createElement('button', { onClick }, children),
        ChakraProvider: Component(),
        Divider: Component('hr'),
        Modal: Component(),
        ModalBody: Component(),
        ModalCloseButton: Component('button'),
        ModalContent: Component(),
        ModalFooter: Component(),
        ModalHeader: Component(),
        ModalOverlay: Component(),
        Stack: Component(),
        Text: Component('span'),
        Wrap: Component(),
        WrapItem: Component(),
    };
});

jest.mock('../../../ui/ReponsiveTooltip', () => {
    return function ResponsiveTooltipMock({ children }) {
        return children;
    };
});

const recipe = {
    recipeAssetId: '13707014208004245427',
    creationAssetId: '6485210212239811',
    flaskAssetId: '15449537292115398209',
    ingredients: [{ assetId: '13321324699537252353', qtyQNT: 1 }],
    tools: ['16510405738781556809'],
};

const items = [
    {
        asset: '6485210212239811',
        type: 'potion',
        description: 'Potion Coral',
        name: 'Potion Coral',
    },
    {
        asset: '13321324699537252353',
        type: 'ingredient',
        description: 'Ingredient of Araucaria',
        name: 'Araucaria',
    },
];

const renderWithStore = ui => {
    const store = configureStore({
        reducer: {
            elyxir: () => ({ elyxir: { definition: { recipes: [recipe] } } }),
            items: () => ({ items }),
        },
    });

    return render(
        <Provider store={store}>
            <ChakraProvider>{ui}</ChakraProvider>
        </Provider>
    );
};

describe('Alchemy OMNO copy', () => {
    it('shows the required L1 recipe possession copy', () => {
        renderWithStore(
            <RecipeSelector
                infoAccount={{ assets: [{ asset: recipe.recipeAssetId, quantityQNT: '1' }] }}
                selectedFlask={{ multiplier: 1 }}
                selectedRecipe={null}
                setSelectedRecipe={jest.fn()}
                getMissingItems={() => []}
            />
        );

        expect(screen.getByText(RECIPE_REQUIREMENT_COPY)).toBeTruthy();
    });

    it('shows locked-assets copy for creates at the lifecycle fix height', () => {
        renderWithStore(
            <CraftingConfirmation
                infoAccount={{ assets: [{ asset: '13321324699537252353', quantityQNT: '1' }] }}
                isOpen
                onClose={jest.fn()}
                selectedRecipe={recipe}
                confirmCrafting={jest.fn()}
                isLoading={false}
                selectedFlask={{ multiplier: 1 }}
                currentHeight={ELYXIR_LIFECYCLE_FIX_HEIGHT}
            />
        );

        expect(screen.getByText(NEW_LIFECYCLE_CREATED_COPY)).toBeTruthy();
        expect(screen.queryByText(/tools return immediately/i)).toBeNull();
    });
});
