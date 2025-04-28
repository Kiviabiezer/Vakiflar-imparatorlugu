/**
 * Utility functions for the Ottoman Empire game
 */

const utils = {
    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random integer
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Format a number with thousands separator
     * @param {number} num - Number to format
     * @returns {string} - Formatted number
     */
    formatNumber: function(num) {
        return Math.round(num).toString();
    },
    
    /**
     * Update display of a resource
     * @param {string} id - Element ID
     * @param {number} value - Value to display
     */
    updateResource: function(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = this.formatNumber(value);
        }
    },
    
    /**
     * Add a log message to the game log
     * @param {string} message - Log message
     */
    log: function(message) {
        const logContainer = document.getElementById('game-log');
        if (!logContainer) return;
        
        const logEntry = document.createElement('p');
        logEntry.innerHTML = message;
        logContainer.prepend(logEntry);
        
        // Limit log entries to prevent performance issues
        const entries = logContainer.querySelectorAll('p');
        if (entries.length > 50) {
            for (let i = 50; i < entries.length; i++) {
                entries[i].remove();
            }
        }
    },
    
    /**
     * Save game data to local storage
     * @param {Object} gameData - Game data object
     */
    saveGame: function(gameData) {
        try {
            localStorage.setItem('ottomanEmpireGame', JSON.stringify(gameData));
            this.log('<span style="color: green">✓</span> Oyun kaydedildi.');
        } catch (error) {
            console.error('Save error:', error);
            this.log('<span style="color: red">✗</span> Oyun kaydedilemedi: ' + error.message);
        }
    },
    
    /**
     * Load game data from local storage
     * @returns {Object|null} - Game data object or null if no saved game
     */
    loadGame: function() {
        try {
            const savedGame = localStorage.getItem('ottomanEmpireGame');
            if (savedGame) {
                return JSON.parse(savedGame);
            }
        } catch (error) {
            console.error('Load error:', error);
            this.log('<span style="color: red">✗</span> Oyun yüklenemedi: ' + error.message);
        }
        return null;
    },
    
    /**
     * Check if player can afford costs
     * @param {Object} cost - Cost object with money, materials, and workers properties
     * @param {Object} resources - Player resources object
     * @returns {boolean} - True if player can afford costs
     */
    canAfford: function(cost, resources) {
        return (
            resources.money >= (cost.money || 0) &&
            resources.materials >= (cost.materials || 0) &&
            resources.workers >= (cost.workers || 0)
        );
    },
    
    /**
     * Pay costs from player resources
     * @param {Object} cost - Cost object with money, materials, and workers properties
     * @param {Object} resources - Player resources object
     */
    payCosts: function(cost, resources) {
        resources.money -= (cost.money || 0);
        resources.materials -= (cost.materials || 0);
        resources.workers -= (cost.workers || 0);
        
        // Update UI
        this.updateResource('money', resources.money);
        this.updateResource('materials', resources.materials);
        this.updateResource('workers', resources.workers);
    },
    
    /**
     * Show modal dialog
     * @param {string} id - Modal element ID
     */
    showModal: function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
        }
    },
    
    /**
     * Hide modal dialog
     * @param {string} id - Modal element ID
     */
    hideModal: function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    /**
     * Create a tooltip element
     * @param {string} text - Tooltip text
     * @returns {HTMLElement} - Tooltip element
     */
    createTooltip: function(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        return tooltip;
    },
    
    /**
     * Position tooltip near an element
     * @param {HTMLElement} tooltip - Tooltip element
     * @param {HTMLElement} target - Target element
     */
    positionTooltip: function(tooltip, target) {
        const rect = target.getBoundingClientRect();
        tooltip.style.left = rect.left + window.scrollX + 'px';
        tooltip.style.top = rect.bottom + window.scrollY + 5 + 'px';
        tooltip.style.display = 'block';
    },
    
    /**
     * Hide all tooltips
     */
    hideTooltips: function() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.display = 'none';
        });
    },
    
    /**
     * Generate a unique ID
     * @returns {string} - Unique ID
     */
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },
    
    /**
     * Shake an element to indicate error
     * @param {HTMLElement} element - Element to shake
     */
    shakeElement: function(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    },
    
    /**
     * Create a historical note element
     * @param {string} text - Historical note text
     * @returns {HTMLElement} - Historical note element
     */
    createHistoricalNote: function(text) {
        const note = document.createElement('div');
        note.className = 'historical-note';
        note.innerHTML = `<i class="fas fa-scroll"></i> <strong>Tarihsel Not:</strong> ${text}`;
        return note;
    }
};
