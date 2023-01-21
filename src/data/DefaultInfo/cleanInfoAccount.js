export const cleanInfoAccount = () => {
    return {
        token: null,
        accountRs: null,
        name: null,
        IGNISBalance: null,
        GIFTZBalance: null,
        GEMSBalance: null,
        transactions: [],
        unconfirmedTxs: [],
        currentAsks: [],
        currentBids: [],
        trades: [],
        usePin: null,
        timestamp: null,
        backupDone: false,
    };
};
