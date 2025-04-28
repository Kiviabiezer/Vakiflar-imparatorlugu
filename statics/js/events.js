/**
 * Event system for the Ottoman Empire game
 */

const events = {
    /**
     * Initialize events module
     */
    init: function() {
        this.activeEvents = [];
        this.eventTypes = this.defineEventTypes();
        this.checkInterval = 30000; // Check for new events every 30 seconds
        
        setInterval(() => this.checkForNewEvents(), this.checkInterval);
    },

    /**
     * Define available event types
     * @returns {Array} - Array of event type objects
     */
    defineEventTypes: function() {
        return [
            {
                id: 'plague',
                name: 'Veba Salgını',
                description: 'Şehirde veba salgını başladı! Acil önlemler alınmalı.',
                duration: 4,
                probability: 0.05,
                effects: {
                    population: -15,
                    happiness: -20,
                    health: -30
                },
                choices: [
                    {
                        text: 'Karantina uygula',
                        cost: { money: 500 },
                        effects: {
                            population: -5,
                            happiness: -10,
                            health: 20
                        }
                    },
                    {
                        text: 'Şifahaneler kur',
                        cost: { money: 800, materials: 200 },
                        effects: {
                            population: -8,
                            happiness: 5,
                            health: 30
                        }
                    }
                ]
            },
            {
                id: 'trade_caravan',
                name: 'Ticaret Kervanı',
                description: 'Büyük bir ticaret kervanı şehre ulaştı!',
                duration: 2,
                probability: 0.1,
                requirements: {
                    buildings: ['caravanserai']
                },
                effects: {
                    money: 200,
                    happiness: 5
                },
                choices: [
                    {
                        text: 'Vergileri düşür',
                        effects: {
                            money: 100,
                            happiness: 15,
                            trade: 10
                        }
                    },
                    {
                        text: 'Normal vergi uygula',
                        effects: {
                            money: 200,
                            happiness: 5,
                            trade: 5
                        }
                    },
                    {
                        text: 'Yüksek vergi al',
                        effects: {
                            money: 300,
                            happiness: -5,
                            trade: -5
                        }
                    }
                ]
            },
            {
                id: 'scholar_visit',
                name: 'Alim Ziyareti',
                description: 'Ünlü bir alim şehri ziyaret etmek istiyor!',
                duration: 3,
                probability: 0.08,
                requirements: {
                    buildings: ['medrese']
                },
                effects: {
                    cultural: 10,
                    education: 15
                },
                choices: [
                    {
                        text: 'Medresede ders vermesini iste',
                        cost: { money: 200 },
                        effects: {
                            education: 25,
                            cultural: 15,
                            happiness: 10
                        }
                    },
                    {
                        text: 'Sarayda ağırla',
                        cost: { money: 400 },
                        effects: {
                            prestige: 20,
                            cultural: 10,
                            happiness: 5
                        }
                    }
                ]
            },
            {
                id: 'drought',
                name: 'Kuraklık',
                description: 'Uzun süredir yağmur yağmıyor, kuraklık tehlikesi baş gösterdi!',
                duration: 5,
                probability: 0.07,
                effects: {
                    food: -20,
                    happiness: -15,
                    money: -100
                },
                choices: [
                    {
                        text: 'Su kanalları inşa et',
                        cost: { money: 600, materials: 300 },
                        effects: {
                            food: 15,
                            happiness: 10
                        }
                    },
                    {
                        text: 'Dışarıdan gıda satın al',
                        cost: { money: 800 },
                        effects: {
                            food: 20,
                            happiness: 5,
                            money: -200
                        }
                    }
                ]
            }
        ];
    },

    /**
     * Check for new random events
     */
    checkForNewEvents: function() {
        const cities = gameState.cities;
        
        for (const city of cities) {
            if (Math.random() < 0.2) { // 20% chance for each city
                const possibleEvents = this.eventTypes.filter(event => {
                    // Check if event requirements are met
                    if (event.requirements) {
                        if (event.requirements.buildings) {
                            const hasRequiredBuildings = event.requirements.buildings.every(buildingId => 
                                city.buildings.some(b => b.type === buildingId)
                            );
                            if (!hasRequiredBuildings) return false;
                        }
                    }
                    
                    // Check probability
                    return Math.random() < event.probability;
                });

                if (possibleEvents.length > 0) {
                    const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
                    this.triggerEvent(selectedEvent, city);
                }
            }
        }
    },

    /**
     * Trigger an event in a city
     * @param {Object} eventType - Event type object
     * @param {Object} city - City object
     */
    triggerEvent: function(eventType, city) {
        const event = {
            ...eventType,
            cityId: city.id,
            startTime: Date.now(),
            endTime: Date.now() + (eventType.duration * 60 * 1000), // Convert minutes to milliseconds
            resolved: false
        };

        this.activeEvents.push(event);
        this.showEventDialog(event);
    },

    /**
     * Show event dialog to player
     * @param {Object} event - Event object
     */
    showEventDialog: function(event) {
        const dialog = document.createElement('div');
        dialog.className = 'event-dialog';
        
        const content = `
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <div class="event-effects">
                ${this.renderEventEffects(event.effects)}
            </div>
            <div class="event-choices">
                ${event.choices.map((choice, index) => `
                    <button class="choice-btn" data-index="${index}">
                        ${choice.text}
                        <div class="choice-effects">
                            ${this.renderEventEffects(choice.effects)}
                            ${choice.cost ? this.renderEventCosts(choice.cost) : ''}
                        </div>
                    </button>
                `).join('')}
            </div>
        `;
        
        dialog.innerHTML = content;
        
        // Add event listeners to choice buttons
        dialog.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = event.choices[parseInt(btn.dataset.index)];
                this.resolveEvent(event, choice);
                dialog.remove();
            });
        });
        
        document.body.appendChild(dialog);
    },

    /**
     * Render event effects
     * @param {Object} effects - Effect object
     * @returns {string} - HTML string
     */
    renderEventEffects: function(effects) {
        return Object.entries(effects).map(([key, value]) => `
            <div class="effect ${value >= 0 ? 'positive' : 'negative'}">
                <i class="fas fa-${this.getEffectIcon(key)}"></i>
                ${key}: ${value >= 0 ? '+' : ''}${value}
            </div>
        `).join('');
    },

    /**
     * Render event costs
     * @param {Object} costs - Cost object
     * @returns {string} - HTML string
     */
    renderEventCosts: function(costs) {
        return Object.entries(costs).map(([key, value]) => `
            <div class="cost">
                <i class="fas fa-${this.getCostIcon(key)}"></i>
                ${key}: -${value}
            </div>
        `).join('');
    },

    /**
     * Get icon for effect type
     * @param {string} effectType - Effect type
     * @returns {string} - Font Awesome icon name
     */
    getEffectIcon: function(effectType) {
        const icons = {
            population: 'users',
            happiness: 'smile',
            health: 'heart',
            money: 'coins',
            food: 'bread-slice',
            cultural: 'book',
            education: 'graduation-cap',
            prestige: 'crown',
            trade: 'exchange-alt'
        };
        return icons[effectType] || 'circle';
    },

    /**
     * Get icon for cost type
     * @param {string} costType - Cost type
     * @returns {string} - Font Awesome icon name
     */
    getCostIcon: function(costType) {
        const icons = {
            money: 'coins',
            materials: 'hammer',
            workers: 'users'
        };
        return icons[costType] || 'circle';
    },

    /**
     * Resolve an event with chosen action
     * @param {Object} event - Event object
     * @param {Object} choice - Chosen action
     */
    resolveEvent: function(event, choice) {
        const city = gameState.cities.find(c => c.id === event.cityId);
        if (!city) return;

        // Apply choice effects
        if (choice.effects) {
            Object.entries(choice.effects).forEach(([key, value]) => {
                if (key in city) {
                    city[key] += value;
                }
            });
        }

        // Apply choice costs
        if (choice.cost) {
            Object.entries(choice.cost).forEach(([key, value]) => {
                if (key in gameState.resources) {
                    gameState.resources[key] -= value;
                }
            });
        }

        event.resolved = true;
        this.activeEvents = this.activeEvents.filter(e => e !== event);

        // Update UI
        gameState.updateUI();
    },

    /**
     * Update active events
     */
    update: function() {
        const now = Date.now();
        
        // Remove expired events
        this.activeEvents = this.activeEvents.filter(event => {
            if (event.endTime <= now && !event.resolved) {
                // Apply default effects for unresolved events
                const city = gameState.cities.find(c => c.id === event.cityId);
                if (city && event.effects) {
                    Object.entries(event.effects).forEach(([key, value]) => {
                        if (key in city) {
                            city[key] += value;
                        }
                    });
                }
                return false;
            }
            return true;
        });
    }
};
