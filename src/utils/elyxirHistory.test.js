import { OMNO_ACCOUNT, OMNO_CONTRACT } from '../data/CONSTANTS';
import { buildAlchemyHistory, getAlchemyCreateParameter } from './elyxirHistory';

const accountRs = 'ARDOR-TEST-ACCOUNT';

const createTx = {
    type: 1,
    subtype: 0,
    senderRS: accountRs,
    recipientRS: OMNO_ACCOUNT,
    timestamp: 100,
    fullHash: 'create-hash',
    attachment: {
        message: JSON.stringify({
            contract: OMNO_CONTRACT,
            operation: [
                {
                    service: 'elyxir',
                    request: 'create',
                    parameter: {
                        jobId: 'job-1',
                        recipeAssetId: '13707014208004245427',
                        creationAssetId: '6485210212239811',
                        flaskAssetId: '15449537292115398209',
                        durationBlocks: 1440,
                    },
                },
            ],
        }),
    },
};

describe('elyxirHistory', () => {
    it('extracts create parameters from Omno Elyxir messages', () => {
        expect(getAlchemyCreateParameter(createTx)).toMatchObject({
            jobId: 'job-1',
            recipeAssetId: '13707014208004245427',
        });
    });

    it('groups create transactions with backend jobs by jobId', () => {
        const events = buildAlchemyHistory({
            accountRs,
            transactions: [createTx],
            jobs: [{ jobId: 'job-1', status: 'STARTED', escrowed: true, startHeight: 4472500, endHeight: 4473940 }],
            items: [],
        });

        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({
            kind: 'job',
            lifecycle: 'new',
            status: 'STARTED',
        });
    });

    it('classifies create transactions without jobs from settlement evidence', () => {
        const settled = buildAlchemyHistory({
            accountRs,
            transactions: [
                createTx,
                {
                    type: 2,
                    subtype: 1,
                    senderRS: OMNO_ACCOUNT,
                    recipientRS: accountRs,
                    timestamp: 120,
                    fullHash: 'settlement-hash',
                    attachment: { asset: '6485210212239811', quantityQNT: '1' },
                },
            ],
            jobs: [],
            items: [],
        });

        const rejected = buildAlchemyHistory({
            accountRs,
            transactions: [createTx],
            jobs: [],
            items: [],
        });

        expect(settled[0].status).toBe('ALREADY_SETTLED');
        expect(rejected[0].status).toBe('REJECTED');
    });
});
