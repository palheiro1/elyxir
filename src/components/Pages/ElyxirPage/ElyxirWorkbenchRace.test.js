import { ChakraProvider } from '@chakra-ui/react';
import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Elyxir from './index';
import { getUserJobs, requestCraftPotionBatch } from '../../../services/Elyxir/elyxir';

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
        Button: ({ children, onClick, isDisabled, disabled }) =>
            React.createElement('button', { type: 'button', onClick, disabled: isDisabled || disabled }, children),
        ChakraProvider: Component(),
        Circle: Component(),
        Divider: Component('hr'),
        Grid: Component(),
        GridItem: Component(),
        Heading: Component('h2'),
        HStack: Component(),
        Icon: ({ as: IconComponent }) => (IconComponent ? React.createElement(IconComponent) : React.createElement('span')),
        Image: ({ src, fallbackSrc }) => React.createElement('img', { alt: '', src: src || fallbackSrc || '' }),
        Input: ({ 'aria-label': ariaLabel, value, onChange, type, min, max, step }) =>
            React.createElement('input', { 'aria-label': ariaLabel, value, onChange, type, min, max, step }),
        Modal: ({ isOpen, children }) => (isOpen ? React.createElement('div', null, children) : null),
        ModalBody: Component(),
        ModalCloseButton: Component('button'),
        ModalContent: Component(),
        ModalFooter: Component(),
        ModalHeader: Component(),
        ModalOverlay: Component(),
        Progress: Component(),
        SimpleGrid: Component(),
        Slider: ({ children }) => React.createElement('div', null, children),
        SliderFilledTrack: Component(),
        SliderThumb: Component(),
        SliderTrack: Component(),
        Stack: Component(),
        Text: Component('span'),
        useDisclosure: () => {
            const [isOpen, setIsOpen] = React.useState(false);
            return {
                isOpen,
                onOpen: () => setIsOpen(true),
                onClose: () => setIsOpen(false),
            };
        },
        useToast: () => jest.fn(),
    };
});

jest.mock('../../../services/Ardor/ardorInterface', () => ({
    addressToAccountId: jest.fn(() => '123456789'),
}));

jest.mock('../../../services/Elyxir/elyxir', () => ({
    getUserJobs: jest.fn(() => Promise.resolve([])),
    requestCraftPotionBatch: jest.fn(() => Promise.resolve({ ok: true })),
    sendCraftPotionAssets: jest.fn(),
    sendCraftPotionMessage: jest.fn(),
}));

jest.mock('../../../utils/walletUtils', () => ({
    checkPin: jest.fn(),
}));

const recipe = {
    recipeAssetId: 'recipe-asset',
    creationAssetId: 'potion-asset',
    ingredients: [{ assetId: 'ingredient-asset', qtyQNT: 1 }],
    tools: ['tool-asset'],
};

const fakeAssets = {
    ingredients: [{ asset: 'ingredient-asset', name: 'Race Herb', quantityQNT: '3', imgUrl: '' }],
    tools: [{ asset: 'tool-asset', name: 'Copper Spoon', quantityQNT: '1', imgUrl: '' }],
    flasks: [{ asset: 'flask-asset', name: 'Small Flask', quantityQNT: '1', multiplier: 1, imgUrl: '' }],
    potions: [{ asset: 'potion-asset', name: 'Race Potion', description: 'A potion for the Race.', imgUrl: '' }],
};

const infoAccount = {
    name: 'Tester',
    accountRs: 'ARDOR-TEST-TEST-TEST-TESTT',
    assets: [
        { asset: 'recipe-asset', quantityQNT: '1' },
        { asset: 'ingredient-asset', quantityQNT: '3' },
        { asset: 'tool-asset', quantityQNT: '1' },
        { asset: 'flask-asset', quantityQNT: '1' },
    ],
};

const renderWorkbench = () => {
    const store = configureStore({
        reducer: {
            elyxir: () => ({
                elyxir: {
                    definition: {
                        minDurationBlocks: 1440,
                        maxDurationBlocks: 43200,
                        recipes: [recipe],
                    },
                },
                fakeAssets,
            }),
            blockchain: () => ({ prev_height: 100000 }),
        },
    });

    return render(
        <Provider store={store}>
            <ChakraProvider>
                <Elyxir
                    infoAccount={infoAccount}
                    embedded
                    walletProvider={{}}
                    walletHostOrigin="https://wallet.example"
                />
            </ChakraProvider>
        </Provider>
    );
};

describe('Elyxir Workbench Race duration', () => {
    beforeEach(() => {
        getUserJobs.mockResolvedValue([]);
        requestCraftPotionBatch.mockResolvedValue({ ok: true });
    });

    it('submits the exact minute/block duration selected by the player', async () => {
        renderWorkbench();

        const durationInput = await screen.findByLabelText('Brewing time in blocks');
        fireEvent.change(durationInput, { target: { value: '1441' } });

        fireEvent.click(screen.getAllByRole('button', { name: /begin brewing/i })[0]);
        const startCraftingButton = await screen.findByRole('button', { name: /start crafting/i });
        await act(async () => {
            fireEvent.click(startCraftingButton);
            await Promise.resolve();
        });

        await waitFor(() => expect(requestCraftPotionBatch).toHaveBeenCalled());
        expect(requestCraftPotionBatch).toHaveBeenCalledWith(
            expect.objectContaining({
                durationBlocks: 1441,
                walletHostOrigin: 'https://wallet.example',
                recipeAssetId: 'recipe-asset',
                creationAssetId: 'potion-asset',
                flaskAssetId: 'flask-asset',
            })
        );
    });
});
