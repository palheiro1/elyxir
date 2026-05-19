export const RECIPE_L1_CHECK_HEIGHT = 4471100;
export const ELYXIR_LIFECYCLE_FIX_HEIGHT = 4472500;

export const RECIPE_REQUIREMENT_COPY =
    'Recipe required: you must hold this recipe in your Ardor account. It will not be transferred or consumed.';

export const NEW_LIFECYCLE_ACTIVE_COPY =
    'Your tools are locked during alchemy and return when the potion resolves.';

export const NEW_LIFECYCLE_CREATED_COPY =
    'Alchemy started. Ingredients, flask, and tools are locked until resolution.';

export const LEGACY_CREATED_COPY =
    'Alchemy started. Ingredients and flask are burned at create time; tools return immediately after create confirmation.';

export const OUTCOME_COPY = {
    success: 'Potion completed. Tools returned and potion delivered.',
    failure: 'Alchemy failed. Ingredients were consumed; tools and flask returned.',
    catastrophic: 'Catastrophic failure. Ingredients, flask, and tools were lost.',
};

export const JOB_STATUS_LABELS = {
    STARTED: 'In alchemy',
    EXPLODED: 'Failed',
    CATASTROPHIC: 'Catastrophic failure',
    FINALIZED: 'Completed',
};

export const getJobLifecycle = job => (job?.escrowed === true ? 'new' : 'legacy');

export const isNewLifecycleJob = job => getJobLifecycle(job) === 'new';

export const getDurationBlocks = job => {
    const startHeight = Number(job?.startHeight);
    const endHeight = Number(job?.endHeight);
    if (!Number.isFinite(startHeight) || !Number.isFinite(endHeight)) return 0;
    return Math.max(0, endHeight - startHeight);
};

export const getJobProgress = (job, currentHeight) => {
    const startHeight = Number(job?.startHeight);
    const endHeight = Number(job?.endHeight);
    const height = Number(currentHeight);
    const durationBlocks = getDurationBlocks(job);

    if (!Number.isFinite(startHeight) || !Number.isFinite(endHeight) || !Number.isFinite(height) || durationBlocks === 0) {
        return {
            durationBlocks,
            completedBlocks: 0,
            blocksLeft: durationBlocks,
            progress: 0,
            isDue: false,
        };
    }

    const completedBlocks = Math.min(durationBlocks, Math.max(0, height - startHeight));
    const blocksLeft = Math.max(0, endHeight - height);

    return {
        durationBlocks,
        completedBlocks,
        blocksLeft,
        progress: Math.min(100, (completedBlocks / durationBlocks) * 100),
        isDue: height >= endHeight,
    };
};

export const getJobOutcome = job => {
    if (job?.status === 'STARTED') return 'active';
    if (job?.status === 'CATASTROPHIC' || job?.isCatastrophic === true) return 'catastrophic';
    if (job?.status === 'EXPLODED') return 'failure';
    if (job?.isSuccess === false || job?.success === false) return 'failure';
    if (job?.status === 'FINALIZED' || job?.isSuccess === true || job?.success === true) return 'success';
    return 'unknown';
};

export const getJobStatusLabel = (job, currentHeight) => {
    if (job?.status === 'STARTED' && job?.settlementPendingReason) return 'Settlement pending';
    if (job?.status === 'STARTED' && getJobProgress(job, currentHeight).isDue) return 'Awaiting OMNO resolution';
    return JOB_STATUS_LABELS[job?.status] || 'Unknown';
};

export const shouldShowCatastropheHeight = job => {
    return Boolean(job?.catastropheHeight && (job?.status === 'CATASTROPHIC' || job?.isCatastrophic === true));
};

export const getLifecycleCopy = job => {
    if (job?.status === 'STARTED' && job?.settlementPendingReason) {
        return 'Settlement is pending in OMNO. The job passed its end height, but asset movements have not completed yet.';
    }
    if (isNewLifecycleJob(job)) return NEW_LIFECYCLE_ACTIVE_COPY;
    if (job?.status === 'STARTED' && job?.isSuccess === true) return 'Potion pending until end height. Tools already returned.';
    return 'Legacy job: ingredients and flask were settled at create time; tools returned immediately after create confirmation.';
};

export const getOutcomeCopy = job => {
    const outcome = getJobOutcome(job);
    if (isNewLifecycleJob(job) && OUTCOME_COPY[outcome]) return OUTCOME_COPY[outcome];
    if (outcome === 'success') return 'Potion completed.';
    if (outcome === 'catastrophic') return OUTCOME_COPY.catastrophic;
    if (outcome === 'failure') return 'Alchemy failed.';
    return 'Outcome unknown.';
};

export const getLifecycleTimeline = (job, currentHeight) => {
    const newLifecycle = isNewLifecycleJob(job);
    const outcome = getJobOutcome(job);
    const progress = getJobProgress(job, currentHeight);

    if (!newLifecycle) {
        const steps = [
            {
                label: 'Submitted',
                description: 'Create request confirmed.',
                state: 'complete',
            },
            {
                label: 'Create settlement',
                description: 'Ingredients and flask burned; tools returned immediately after create confirmation.',
                state: 'complete',
            },
        ];

        if (outcome === 'active') {
            steps.push({
                label: 'Potion pending',
                description:
                    job?.isSuccess === true
                        ? `Potion delivery pending until block ${job?.endHeight}.`
                        : `Alchemy remains visible until block ${job?.endHeight}.`,
                state: progress.isDue ? 'current' : 'pending',
            });
        } else {
            steps.push({
                label: getJobStatusLabel(job, currentHeight),
                description: getOutcomeCopy(job),
                state: 'complete',
            });
        }

        return steps;
    }

    const steps = [
        {
            label: 'Submitted',
            description: 'Create request confirmed.',
            state: 'complete',
        },
        {
            label: 'Assets locked',
            description: 'Ingredients, flask, and tools are held in Elyxir escrow.',
            state: 'complete',
        },
        {
            label: 'Alchemy in progress',
            description: NEW_LIFECYCLE_ACTIVE_COPY,
            state: outcome === 'active' ? 'current' : 'complete',
        },
    ];

    if (outcome === 'catastrophic') {
        steps.push({
            label: 'Catastrophic failure',
            description: job?.catastropheHeight
                ? `All locked assets burned at block ${job.catastropheHeight}.`
                : OUTCOME_COPY.catastrophic,
            state: 'complete',
        });
        return steps;
    }

    if (outcome === 'success') {
        steps.push({
            label: 'Ingredients + flask burned; tools returned; potion delivered',
            description: OUTCOME_COPY.success,
            state: 'complete',
        });
        return steps;
    }

    if (outcome === 'failure') {
        steps.push({
            label: 'Ingredients burned; tools + flask returned',
            description: OUTCOME_COPY.failure,
            state: 'complete',
        });
        return steps;
    }

    steps.push({
        label: `Resolution at block ${job?.endHeight ?? '-'}`,
        description: progress.isDue ? 'Waiting for backend finalization.' : 'Outcome resolves at end height.',
        state: progress.isDue ? 'current' : 'pending',
    });

    return steps;
};
