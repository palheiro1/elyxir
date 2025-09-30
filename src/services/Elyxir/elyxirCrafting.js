/**
 * Elyxir Crafting - On-chain Transaction Handler
 * Implements real blockchain transactions for Elyxir potion crafting
 */

import { transferAsset, sendMessage, getBlockchainStatus, getBlock } from '../Ardor/ardorInterface';
import { okToast, errorToast } from '../../utils/alerts';

// Configuration constants from the wallet integration guide
export const ELYXIR_CONFIG = {
    // Contract accounts
    CONTRACT_ACCOUNT: "ARDOR-CLUN-N4AJ-ZQWK-GD74N",
    BURN_ACCOUNT: "ARDOR-RQYR-NMDJ-3Q8U-9UAXH",
    
    // Official potion recipes with real asset IDs
    POTION_RECIPES: {
        "Whispering Gale": {
            recipeAsset: "12936439663349626618",
            potionAsset: "6485210212239811",
            ingredients: [
                {assetId: "65767141008711421", name: "Wind Essence", baseQNT: 1},
                {assetId: "15284691712437925618", name: "Feather", baseQNT: 1},
                {assetId: "18101012326255288772", name: "Cloud Essence", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        },
        "Tideheart": {
            recipeAsset: "7024690161218732154",
            potionAsset: "7582224115266007515",
            ingredients: [
                {assetId: "10444425886085847503", name: "Sea Water", baseQNT: 1},
                {assetId: "10917692030112170713", name: "Crystal Water", baseQNT: 1},
                {assetId: "7891814295348826088", name: "Rainbow Dust", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        },
        "Stoneblood": {
            recipeAsset: "11654119158397769364",
            potionAsset: "10474636406729395731",
            ingredients: [
                {assetId: "1941380340903453000", name: "Tree Bark", baseQNT: 1},
                {assetId: "17472981396773816914", name: "Bone Powder", baseQNT: 1},
                {assetId: "374078224198142471", name: "Volcanic Ash", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        },
        "Eternal Silk": {
            recipeAsset: "1462047204733593633",
            potionAsset: "5089659721388119266",
            ingredients: [
                {assetId: "13446501052073878899", name: "Holi Powder", baseQNT: 1},
                {assetId: "2603114092541070832", name: "Himalayan Snow", baseQNT: 1},
                {assetId: "8821500247715349893", name: "Rahu Saliva", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        },
        "Coral": {
            recipeAsset: "6864800023593094679",
            potionAsset: "8693351662911145147",
            ingredients: [
                {assetId: "10444425886085847503", name: "Sea Water", baseQNT: 1},
                {assetId: "16412049206728355506", name: "Kangaroo Tail", baseQNT: 1},
                {assetId: "13430257599807483745", name: "Araucarian Resine", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        },
        "Feathered Flame": {
            recipeAsset: "1770779863759720918",
            potionAsset: "11206437400477435454",
            ingredients: [
                {assetId: "8717959006135737805", name: "Bottled Sunlight", baseQNT: 1},
                {assetId: "15284691712437925618", name: "Feather", baseQNT: 1},
                {assetId: "12313032092046113556", name: "Peyote", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        },
        "Shifting Dunes": {
            recipeAsset: "10956456574154580310",
            potionAsset: "12861522637067934750",
            ingredients: [
                {assetId: "10229749181769297696", name: "Desert Sand", baseQNT: 1},
                {assetId: "609721796834652174", name: "Snake Skin", baseQNT: 1},
                {assetId: "583958094572828441", name: "Mustard Seeds", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        },
        "Forgotten Grove": {
            recipeAsset: "7535070915409870441",
            potionAsset: "3858707486313568681",
            ingredients: [
                {assetId: "8966516609271135665", name: "Garden Flower", baseQNT: 1},
                {assetId: "1941380340903453000", name: "Tree Bark", baseQNT: 1},
                {assetId: "3865726407233803673", name: "Wolf Fang", baseQNT: 1}
            ],
            tools: [
                {assetId: "7394449015011337044", name: "Bellow"},
                {assetId: "1310229991284473521", name: "Cauldron"},
                {assetId: "188493294393002400", name: "Mortar"},
                {assetId: "9451976923053037726", name: "Ladle"}
            ]
        }
    },
    
    // Flask configurations
    FLASKS: {
        "4367881087678870632": {name: "Conical Flask", multiplier: 1},
        "3758988694981372970": {name: "Pear Flask", multiplier: 2},
        "1328293559375692481": {name: "Kjeldahl Flask", multiplier: 3},
        "8026549983053279231": {name: "Florence Flask", multiplier: 4},
        "9118586585609900793": {name: "Round-Bottom Flask", multiplier: 5}
    },
    
    // Duration options with success rates
    DURATION_OPTIONS: [
        { blocks: 1440, days: 1, successChance: 31 },
        { blocks: 7200, days: 5, successChance: 38 },
        { blocks: 14400, days: 10, successChance: 46 },
        { blocks: 21600, days: 15, successChance: 55 },
        { blocks: 28800, days: 20, successChance: 63 },
        { blocks: 43200, days: 30, successChance: 80 }
    ]
};

/**
 * Elyxir Job Manager - Handles on-chain crafting operations
 */
export class ElyxirJobManager {
    constructor() {
        this.activeJobs = this.loadJobsFromStorage();
        this.completedJobs = this.loadCompletedJobsFromStorage();
    }

    /**
     * Get active crafting jobs
     */
    getActiveJobs() {
        return this.activeJobs;
    }

    /**
     * Get completed crafting jobs
     */
    getCompletedJobs() {
        return this.completedJobs;
    }

    /**
     * Start a new crafting job - Main entry point for wallet integration
     */
    async startCraftingJob(userAccount, userPassphrase, potionName, durationBlocks, flaskAssetId = "4367881087678870632", toast) {
        try {
            const recipe = ELYXIR_CONFIG.POTION_RECIPES[potionName];
            if (!recipe) {
                throw new Error(`Unknown potion recipe: ${potionName}`);
            }

            const flask = ELYXIR_CONFIG.FLASKS[flaskAssetId];
            if (!flask) {
                throw new Error(`Unknown flask: ${flaskAssetId}`);
            }

            // Validate user has all required assets
            const validation = await this.validateRequirements(userAccount, recipe, flask.multiplier, flaskAssetId);
            if (!validation.isValid) {
                throw new Error(`Missing requirements: ${validation.missing.join(', ')}`);
            }

            // Create unique job ID
            const jobId = this.generateJobId(potionName);

            // Get current block height
            const blockchainStatus = await getBlockchainStatus();
            const startBlock = blockchainStatus.numberOfBlocks;
            const endBlock = startBlock + durationBlocks;

            // Calculate success probability
            const successChance = this.calculateSuccessProbability(durationBlocks);

            // Execute on-chain transactions
            const transactionResults = await this.executeTransactions({
                userAccount,
                userPassphrase,
                recipe,
                flaskMultiplier: flask.multiplier,
                flaskAssetId,
                jobId,
                durationBlocks
            });

            if (!transactionResults.success) {
                throw new Error(`Transaction failed: ${transactionResults.error}`);
            }

            // Store job data
            const jobData = {
                jobId,
                userAccount,
                potionName,
                recipeAsset: recipe.recipeAsset,
                potionAsset: recipe.potionAsset,
                durationBlocks,
                startBlock,
                endBlock,
                successChance,
                flaskMultiplier: flask.multiplier,
                flaskAssetId,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                transactionHashes: transactionResults.transactionHashes
            };

            this.activeJobs.push(jobData);
            this.saveJobsToStorage();

            if (toast) {
                okToast(`Crafting job started! Job ID: ${jobId}`, toast);
            }

            return {
                success: true,
                jobId,
                message: `Crafting job for ${potionName} started successfully!`,
                estimatedCompletion: new Date(Date.now() + (durationBlocks * 60 * 1000)) // Assuming 1 minute per block
            };

        } catch (error) {
            console.error('🔴 [ELYXIR CRAFTING] Job creation failed:', error);
            if (toast) {
                errorToast(error.message, toast);
            }
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Execute the blockchain transactions for crafting
     */
    async executeTransactions({ userAccount, userPassphrase, recipe, flaskMultiplier, flaskAssetId, jobId, durationBlocks }) {
        const transactionHashes = [];
        
        try {
            // Step 1: Transfer ingredients to contract (scaled by flask multiplier)
            for (const ingredient of recipe.ingredients) {
                const quantity = ingredient.baseQNT * flaskMultiplier;
                const txHash = await transferAsset({
                    asset: ingredient.assetId,
                    quantityQNT: quantity,
                    recipient: ELYXIR_CONFIG.CONTRACT_ACCOUNT,
                    passPhrase: userPassphrase,
                    message: JSON.stringify({
                        contract: 'ElyxirCrafting',
                        operation: 'transferIngredient',
                        jobId,
                        ingredient: ingredient.name,
                        quantity
                    }),
                    messagePrunable: true,
                    deadline: 1440,
                    priority: 'HIGH'
                });
                
                if (!txHash) {
                    throw new Error(`Failed to transfer ingredient: ${ingredient.name}`);
                }
                transactionHashes.push(txHash);
            }

            // Step 2: Transfer tools to contract (always 1 QNT each, not scaled)
            for (const tool of recipe.tools) {
                const txHash = await transferAsset({
                    asset: tool.assetId,
                    quantityQNT: 1,
                    recipient: ELYXIR_CONFIG.CONTRACT_ACCOUNT,
                    passPhrase: userPassphrase,
                    message: JSON.stringify({
                        contract: 'ElyxirCrafting',
                        operation: 'transferTool',
                        jobId,
                        tool: tool.name
                    }),
                    messagePrunable: true,
                    deadline: 1440,
                    priority: 'HIGH'
                });
                
                if (!txHash) {
                    throw new Error(`Failed to transfer tool: ${tool.name}`);
                }
                transactionHashes.push(txHash);
            }

            // Step 3: Transfer flask to contract
            const flaskTxHash = await transferAsset({
                asset: flaskAssetId,
                quantityQNT: 1,
                recipient: ELYXIR_CONFIG.CONTRACT_ACCOUNT,
                passPhrase: userPassphrase,
                message: JSON.stringify({
                    contract: 'ElyxirCrafting',
                    operation: 'transferFlask',
                    jobId,
                    flask: ELYXIR_CONFIG.FLASKS[flaskAssetId].name
                }),
                messagePrunable: true,
                deadline: 1440,
                priority: 'HIGH'
            });
            
            if (!flaskTxHash) {
                throw new Error('Failed to transfer flask');
            }
            transactionHashes.push(flaskTxHash);

            // Step 4: Send crafting job creation message to contract
            const jobMessage = JSON.stringify({
                contract: 'ElyxirCrafting',
                operation: 'createJob',
                jobId,
                potionName: recipe.potionAsset,
                recipeAsset: recipe.recipeAsset,
                durationBlocks,
                flaskMultiplier,
                userAccount,
                ingredients: recipe.ingredients.map(ing => ({
                    assetId: ing.assetId,
                    name: ing.name,
                    quantity: ing.baseQNT * flaskMultiplier
                })),
                tools: recipe.tools,
                flask: {
                    assetId: flaskAssetId,
                    name: ELYXIR_CONFIG.FLASKS[flaskAssetId].name,
                    multiplier: flaskMultiplier
                }
            });

            const jobTxHash = await sendMessage({
                recipient: ELYXIR_CONFIG.CONTRACT_ACCOUNT,
                passPhrase: userPassphrase,
                message: jobMessage
            });

            if (!jobTxHash) {
                throw new Error('Failed to create job message');
            }
            transactionHashes.push(jobTxHash);

            return {
                success: true,
                transactionHashes
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                transactionHashes
            };
        }
    }

    /**
     * Complete a ready crafting job
     */
    async completeCraftingJob(jobId, userPassphrase, toast) {
        try {
            const job = this.activeJobs.find(j => j.jobId === jobId);
            if (!job) {
                throw new Error(`Job not found: ${jobId}`);
            }

            // Check if job is ready
            const blockchainStatus = await getBlockchainStatus();
            const currentBlock = blockchainStatus.numberOfBlocks;
            
            if (currentBlock < job.endBlock) {
                const blocksRemaining = job.endBlock - currentBlock;
                throw new Error(`Job not ready yet. ${blocksRemaining} blocks remaining.`);
            }

            // Get the completion block hash for RNG
            const completionBlock = await getBlock(job.endBlock);
            if (!completionBlock) {
                throw new Error('Could not retrieve completion block');
            }

            // Calculate success based on block hash RNG
            const isSuccess = this.calculateRNGFromBlock(completionBlock.blockHash, job.successChance);

            // Send completion message to contract
            const completionMessage = JSON.stringify({
                contract: 'ElyxirCrafting',
                operation: 'completeJob',
                jobId,
                userAccount: job.userAccount,
                completionBlock: job.endBlock,
                blockHash: completionBlock.blockHash,
                isSuccess,
                potionAsset: job.potionAsset,
                toolsToReturn: ELYXIR_CONFIG.POTION_RECIPES[job.potionName].tools
            });

            const completionTxHash = await sendMessage({
                recipient: ELYXIR_CONFIG.CONTRACT_ACCOUNT,
                passPhrase: userPassphrase,
                message: completionMessage
            });

            if (!completionTxHash) {
                throw new Error('Failed to send completion message');
            }

            // Move job to completed
            const completedJob = {
                ...job,
                status: isSuccess ? 'SUCCESS' : 'FAILED',
                completedAt: new Date().toISOString(),
                completionTxHash,
                result: isSuccess ? 'Potion crafted successfully!' : 'Crafting failed, tools returned.'
            };

            this.activeJobs = this.activeJobs.filter(j => j.jobId !== jobId);
            this.completedJobs.push(completedJob);
            this.saveJobsToStorage();
            this.saveCompletedJobsToStorage();

            if (toast) {
                if (isSuccess) {
                    okToast(`🎉 Crafting successful! Your ${job.potionName} is ready!`, toast);
                } else {
                    errorToast(`💔 Crafting failed, but your tools have been returned.`, toast);
                }
            }

            return {
                success: true,
                result: isSuccess ? 'SUCCESS' : 'FAILED',
                message: completedJob.result,
                potionName: job.potionName
            };

        } catch (error) {
            console.error('🔴 [ELYXIR COMPLETION] Job completion failed:', error);
            if (toast) {
                errorToast(error.message, toast);
            }
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Auto-complete all ready jobs for a user
     */
    async autoCompleteReadyJobs(userAccount, userPassphrase, toast) {
        const userJobs = this.activeJobs.filter(job => job.userAccount === userAccount);
        const blockchainStatus = await getBlockchainStatus();
        const currentBlock = blockchainStatus.numberOfBlocks;
        
        const readyJobs = userJobs.filter(job => currentBlock >= job.endBlock);
        
        if (readyJobs.length === 0) {
            if (toast) {
                okToast('No jobs ready for completion', toast);
            }
            return { completedCount: 0 };
        }

        let completedCount = 0;
        for (const job of readyJobs) {
            const result = await this.completeCraftingJob(job.jobId, userPassphrase, null);
            if (result.success) {
                completedCount++;
            }
        }

        if (toast) {
            okToast(`Auto-completed ${completedCount} jobs`, toast);
        }

        return { completedCount };
    }

    /**
     * Validate user has all required assets for crafting
     */
    async validateRequirements(userAccount, recipe, flaskMultiplier, flaskAssetId) {
        // This would typically check the user's actual asset balances
        // For now, return a simplified validation
        const missing = [];
        
        // Note: In a real implementation, you would:
        // 1. Get user's asset balances from getAccountAssets
        // 2. Check each ingredient quantity * flaskMultiplier
        // 3. Check each tool (always 1 QNT required)
        // 4. Check flask (1 QNT required)
        
        return {
            isValid: missing.length === 0,
            missing
        };
    }

    /**
     * Calculate RNG result from block hash
     */
    calculateRNGFromBlock(blockHash, successThreshold) {
        const seed = blockHash.substring(0, 16);
        const seedInt = parseInt(seed, 16);
        const probability = (seedInt % 100) + 1;
        return probability <= successThreshold;
    }

    /**
     * Calculate success probability based on duration
     */
    calculateSuccessProbability(durationBlocks) {
        const option = ELYXIR_CONFIG.DURATION_OPTIONS.find(opt => opt.blocks === durationBlocks);
        return option ? option.successChance : 31; // Default to 31% for 1 day
    }

    /**
     * Generate unique job ID
     */
    generateJobId(potionName) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `${potionName.replace(/\s+/g, '_').toUpperCase()}_${timestamp}_${random}`;
    }

    /**
     * Get user's active jobs
     */
    getUserActiveJobs(userAccount) {
        return this.activeJobs.filter(job => job.userAccount === userAccount);
    }

    /**
     * Get user's completed jobs
     */
    getUserCompletedJobs(userAccount, limit = 10) {
        return this.completedJobs
            .filter(job => job.userAccount === userAccount)
            .slice(-limit)
            .reverse();
    }

    /**
     * Storage methods
     */
    saveJobsToStorage() {
        localStorage.setItem('elyxir_active_jobs', JSON.stringify(this.activeJobs));
    }

    loadJobsFromStorage() {
        const stored = localStorage.getItem('elyxir_active_jobs');
        return stored ? JSON.parse(stored) : [];
    }

    saveCompletedJobsToStorage() {
        localStorage.setItem('elyxir_completed_jobs', JSON.stringify(this.completedJobs));
    }

    loadCompletedJobsFromStorage() {
        const stored = localStorage.getItem('elyxir_completed_jobs');
        return stored ? JSON.parse(stored) : [];
    }
}

// Export singleton instance
export const elyxirJobManager = new ElyxirJobManager();