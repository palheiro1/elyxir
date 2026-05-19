import { ChakraProvider } from '@chakra-ui/react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ShowAlchemyHistory from './ShowAlchemyHistory';
import { NEW_LIFECYCLE_ACTIVE_COPY } from '../../../utils/elyxirLifecycle';

jest.mock('@chakra-ui/react', () => {
    const React = require('react');
    const Component =
        (tag = 'div') =>
        ({ children }) =>
            React.createElement(tag, null, children);

    return {
        Badge: Component('span'),
        Box: Component(),
        Button: ({ children, onClick }) => React.createElement('button', { onClick }, children),
        Center: Component(),
        ChakraProvider: Component(),
        Divider: Component('hr'),
        SimpleGrid: Component(),
        Stack: Component(),
        Text: Component('span'),
    };
});

const renderWithStore = ui => {
    const store = configureStore({
        reducer: {
            items: () => ({
                items: [
                    {
                        asset: '6485210212239811',
                        type: 'potion',
                        description: 'Potion Coral',
                        name: 'Potion Coral',
                    },
                ],
            }),
            blockchain: () => ({ prev_height: 4472600 }),
        },
    });

    return render(
        <Provider store={store}>
            <ChakraProvider>{ui}</ChakraProvider>
        </Provider>
    );
};

describe('ShowAlchemyHistory', () => {
    it('renders escrow lifecycle timeline for active alchemy jobs', () => {
        renderWithStore(
            <ShowAlchemyHistory
                visibleAlchemy={10}
                setVisibleAlchemy={jest.fn()}
                epochBeginning={new Date(Date.UTC(2018, 0, 1, 0, 0, 0))}
                alchemyEvents={[
                    {
                        id: 'job-1',
                        kind: 'job',
                        status: 'STARTED',
                        statusLabel: 'STARTED',
                        lifecycle: 'new',
                        outcome: 'active',
                        timestamp: 100,
                        movements: [],
                        createTx: null,
                        parameter: null,
                        job: {
                            jobId: 'job-1',
                            escrowed: true,
                            status: 'STARTED',
                            creationAssetId: '6485210212239811',
                            startHeight: 4472500,
                            endHeight: 4473940,
                        },
                    },
                ]}
            />
        );

        expect(screen.getByText('Assets locked')).toBeTruthy();
        expect(screen.getAllByText(NEW_LIFECYCLE_ACTIVE_COPY).length).toBeGreaterThan(0);
    });

    it('marks transaction-window linked movements as inferred', () => {
        renderWithStore(
            <ShowAlchemyHistory
                visibleAlchemy={10}
                setVisibleAlchemy={jest.fn()}
                epochBeginning={new Date(Date.UTC(2018, 0, 1, 0, 0, 0))}
                alchemyEvents={[
                    {
                        id: 'job-1',
                        kind: 'job',
                        status: 'STARTED',
                        statusLabel: 'STARTED',
                        lifecycle: 'new',
                        outcome: 'active',
                        timestamp: 100,
                        createTx: null,
                        parameter: null,
                        job: {
                            jobId: 'job-1',
                            escrowed: true,
                            status: 'STARTED',
                            creationAssetId: '6485210212239811',
                            startHeight: 4472500,
                            endHeight: 4473940,
                        },
                        movements: [
                            {
                                id: 'movement-1',
                                direction: 'out',
                                itemName: 'Potion Coral',
                                quantityQNT: '1',
                                timestamp: 110,
                                inferred: true,
                            },
                        ],
                    },
                ]}
            />
        );

        expect(screen.getByText('Inferred')).toBeTruthy();
    });
});
