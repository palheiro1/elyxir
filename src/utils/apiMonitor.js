/**
 * @fileoverview API Call Monitoring Utility
 * @description Monitors and prevents excessive API calls to solve infinite loop issues
 * @author GitHub Copilot
 * @version 1.0.0
 */

class APIMonitor {
    constructor() {
        this.calls = new Map();
        this.MAX_CALLS_PER_MINUTE = 30; // Limit API calls per minute
        this.WINDOW_SIZE = 60000; // 1 minute window
    }

    /**
     * Check if an API call should be allowed
     * @param {string} endpoint - API endpoint identifier
     * @returns {boolean} - Whether the call should proceed
     */
    shouldAllowCall(endpoint) {
        const now = Date.now();
        const windowStart = now - this.WINDOW_SIZE;
        
        // Get or create call history for this endpoint
        if (!this.calls.has(endpoint)) {
            this.calls.set(endpoint, []);
        }
        
        const callHistory = this.calls.get(endpoint);
        
        // Remove calls outside the current window
        const recentCalls = callHistory.filter(time => time > windowStart);
        this.calls.set(endpoint, recentCalls);
        
        // Check if we're under the limit
        if (recentCalls.length >= this.MAX_CALLS_PER_MINUTE) {
            console.warn(`⚠️ API Monitor: Rate limit exceeded for ${endpoint}. Calls in last minute: ${recentCalls.length}`);
            return false;
        }
        
        // Record this call
        recentCalls.push(now);
        this.calls.set(endpoint, recentCalls);
        
        console.log(`✅ API Monitor: Allowing call to ${endpoint}. Recent calls: ${recentCalls.length}/${this.MAX_CALLS_PER_MINUTE}`);
        return true;
    }

    /**
     * Get statistics for all monitored endpoints
     * @returns {Object} - Call statistics
     */
    getStats() {
        const stats = {};
        const now = Date.now();
        const windowStart = now - this.WINDOW_SIZE;
        
        for (const [endpoint, callHistory] of this.calls.entries()) {
            const recentCalls = callHistory.filter(time => time > windowStart);
            stats[endpoint] = {
                recentCalls: recentCalls.length,
                limit: this.MAX_CALLS_PER_MINUTE,
                lastCall: recentCalls.length > 0 ? new Date(Math.max(...recentCalls)).toISOString() : 'Never'
            };
        }
        
        return stats;
    }

    /**
     * Reset all call history
     */
    reset() {
        this.calls.clear();
        console.log('🔄 API Monitor: Call history reset');
    }

    /**
     * Log current statistics to console
     */
    logStats() {
        const stats = this.getStats();
        console.table(stats);
    }
}

// Create singleton instance
const apiMonitor = new APIMonitor();

// Expose to window for debugging
if (typeof window !== 'undefined') {
    window.apiMonitor = apiMonitor;
}

export default apiMonitor;
