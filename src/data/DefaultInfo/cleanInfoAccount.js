export const cleanInfoAccount = () => {
    return {
        token: null,
        accountRs: null,
        name: null,
        IGNISBalance: 0,
        GIFTZBalance: 0,
        GEMBalance: 0,
        WETHBalance: 0,
        MANABalance: 0,
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
