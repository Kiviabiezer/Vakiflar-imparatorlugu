/**
 * Diplomacy system for the Ottoman Empire game
 */

const diplomacy = {
    /**
     * Initialize diplomacy module
     */
    init: function() {
        this.relations = {};
        this.treaties = [];
        this.initializeRelations();
    },

    /**
     * Initialize diplomatic relations
     */
    initializeRelations: function() {
        const empires = [
            {
                id: 'safavid',
                name: 'Safevi İmparatorluğu',
                baseRelation: -20,
                tradeValue: 100,
                militaryStrength: 80
            },
            {
                id: 'mamluk',
                name: 'Memlük Sultanlığı',
                baseRelation: 0,
                tradeValue: 120,
                militaryStrength: 70
            },
            {
                id: 'venice',
                name: 'Venedik Cumhuriyeti',
                baseRelation: -10,
                tradeValue: 150,
                militaryStrength: 60
            },
            {
                id: 'hungary',
                name: 'Macar Krallığı',
                baseRelation: -30,
                tradeValue: 80,
                militaryStrength: 65
            },
            {
                id: 'poland',
                name: 'Polonya-Litvanya Birliği',
                baseRelation: 0,
                tradeValue: 90,
                militaryStrength: 75
            }
        ];

        empires.forEach(empire => {
            this.relations[empire.id] = {
                ...empire,
                relation: empire.baseRelation,
                treaties: []
            };
        });
    },

    /**
     * Get all diplomatic relations
     * @returns {Object} - Relations object
     */
    getRelations: function() {
        return this.relations;
    },

    /**
     * Get relation with specific empire
     * @param {string} empireId - Empire ID
     * @returns {Object|null} - Relation object or null
     */
    getRelation: function(empireId) {
        return this.relations[empireId] || null;
    },

    /**
     * Change relation with empire
     * @param {string} empireId - Empire ID
     * @param {number} amount - Amount to change
     * @returns {number} - New relation value
     */
    changeRelation: function(empireId, amount) {
        if (this.relations[empireId]) {
            this.relations[empireId].relation = Math.max(-100, Math.min(100, this.relations[empireId].relation + amount));
            return this.relations[empireId].relation;
        }
        return null;
    },

    /**
     * Available diplomatic actions
     */
    actions: {
        IMPROVE_RELATIONS: {
            name: 'İlişkileri Geliştir',
            cost: { money: 200 },
            effect: 10,
            cooldown: 30 // 30 days
        },
        TRADE_AGREEMENT: {
            name: 'Ticaret Anlaşması',
            cost: { money: 500 },
            effect: 15,
            requirements: { relation: 0 },
            benefits: {
                money: 100,
                trade: 10
            }
        },
        MILITARY_ALLIANCE: {
            name: 'Askeri İttifak',
            cost: { money: 1000 },
            effect: 25,
            requirements: { relation: 50 },
            benefits: {
                military: 15,
                prestige: 10
            }
        },
        ROYAL_MARRIAGE: {
            name: 'Hanedanlar Arası Evlilik',
            cost: { money: 2000 },
            effect: 30,
            requirements: { relation: 70 },
            benefits: {
                prestige: 20,
                stability: 10
            }
        }
    },

    /**
     * Check if diplomatic action is available
     * @param {string} actionId - Action ID
     * @param {string} empireId - Target empire ID
     * @returns {Object} - Result with canDo and reason properties
     */
    canDoAction: function(actionId, empireId) {
        const action = this.actions[actionId];
        const relation = this.relations[empireId];
        
        if (!action || !relation) {
            return { canDo: false, reason: 'Geçersiz eylem veya imparatorluk' };
        }

        // Check costs
        if (action.cost) {
            for (const [resource, amount] of Object.entries(action.cost)) {
                if (gameState.resources[resource] < amount) {
                    return { canDo: false, reason: `Yetersiz ${resource}` };
                }
            }
        }

        // Check relation requirements
        if (action.requirements && action.requirements.relation) {
            if (relation.relation < action.requirements.relation) {
                return { 
                    canDo: false, 
                    reason: `En az ${action.requirements.relation} ilişki puanı gerekli` 
                };
            }
        }

        // Check cooldown
        const lastAction = relation.lastAction?.[actionId];
        if (lastAction && action.cooldown) {
            const daysSince = (Date.now() - lastAction) / (1000 * 60 * 60 * 24);
            if (daysSince < action.cooldown) {
                return { 
                    canDo: false, 
                    reason: `${Math.ceil(action.cooldown - daysSince)} gün beklemelisiniz` 
                };
            }
        }

        return { canDo: true };
    },

    /**
     * Perform diplomatic action
     * @param {string} actionId - Action ID
     * @param {string} empireId - Target empire ID
     * @returns {Object} - Result object
     */
    doAction: function(actionId, empireId) {
        const check = this.canDoAction(actionId, empireId);
        if (!check.canDo) {
            return { success: false, message: check.reason };
        }

        const action = this.actions[actionId];
        const relation = this.relations[empireId];

        // Apply costs
        if (action.cost) {
            Object.entries(action.cost).forEach(([resource, amount]) => {
                gameState.resources[resource] -= amount;
            });
        }

        // Apply effects
        this.changeRelation(empireId, action.effect);

        // Apply benefits
        if (action.benefits) {
            Object.entries(action.benefits).forEach(([key, value]) => {
                if (key in gameState.resources) {
                    gameState.resources[key] += value;
                }
            });
        }

        // Record action time
        if (!relation.lastAction) relation.lastAction = {};
        relation.lastAction[actionId] = Date.now();

        // Add treaty if applicable
        if (actionId === 'TRADE_AGREEMENT' || actionId === 'MILITARY_ALLIANCE') {
            this.addTreaty(actionId, empireId);
        }

        return {
            success: true,
            message: `${action.name} başarıyla gerçekleştirildi`
        };
    },

    /**
     * Add new treaty
     * @param {string} type - Treaty type
     * @param {string} empireId - Empire ID
     */
    addTreaty: function(type, empireId) {
        const treaty = {
            type,
            empireId,
            startDate: Date.now()
        };

        this.treaties.push(treaty);
        this.relations[empireId].treaties.push(treaty);
    },

    /**
     * Get active treaties
     * @returns {Array} - Array of treaty objects
     */
    getTreaties: function() {
        return this.treaties;
    },

    /**
     * Render diplomacy interface
     * @param {HTMLElement} container - Container element
     */
    render: function(container) {
        container.innerHTML = '';
        
        Object.values(this.relations).forEach(empire => {
            const relationClass = this.getRelationClass(empire.relation);
            
            const empireEl = document.createElement('div');
            empireEl.className = 'empire-card';
            empireEl.innerHTML = `
                <h3>${empire.name}</h3>
                <div class="relation ${relationClass}">
                    İlişki: ${empire.relation}
                </div>
                <div class="stats">
                    <div>Ticaret Değeri: ${empire.tradeValue}</div>
                    <div>Askeri Güç: ${empire.militaryStrength}</div>
                </div>
                <div class="treaties">
                    ${empire.treaties.map(treaty => `
                        <div class="treaty ${treaty.type.toLowerCase()}">
                            ${this.getTreatyName(treaty.type)}
                        </div>
                    `).join('')}
                </div>
                <div class="actions">
                    ${Object.entries(this.actions).map(([id, action]) => {
                        const check = this.canDoAction(id, empire.id);
                        return `
                            <button class="action-btn ${check.canDo ? '' : 'disabled'}"
                                    data-action="${id}"
                                    data-empire="${empire.id}"
                                    ${check.canDo ? '' : 'disabled'}>
                                ${action.name}
                                <div class="tooltip">
                                    ${check.canDo ? 
                                        `Maliyet: ${Object.entries(action.cost).map(([r, v]) => `${r}: ${v}`).join(', ')}` :
                                        check.reason
                                    }
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
            
            container.appendChild(empireEl);
        });

        // Add event listeners
        container.querySelectorAll('.action-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const actionId = btn.dataset.action;
                const empireId = btn.dataset.empire;
                const result = this.doAction(actionId, empireId);
                
                if (result.success) {
                    utils.log(result.message, 'success');
                    this.render(container);
                    gameState.updateUI();
                } else {
                    utils.log(result.message, 'error');
                }
            });
        });
    },

    /**
     * Get relation class for CSS
     * @param {number} relation - Relation value
     * @returns {string} - CSS class
     */
    getRelationClass: function(relation) {
        if (relation >= 75) return 'excellent';
        if (relation >= 50) return 'good';
        if (relation >= 25) return 'positive';
        if (relation >= 0) return 'neutral';
        if (relation >= -25) return 'poor';
        if (relation >= -50) return 'bad';
        return 'hostile';
    },

    /**
     * Get treaty name
     * @param {string} type - Treaty type
     * @returns {string} - Treaty name
     */
    getTreatyName: function(type) {
        const names = {
            TRADE_AGREEMENT: 'Ticaret Anlaşması',
            MILITARY_ALLIANCE: 'Askeri İttifak'
        };
        return names[type] || type;
    }
};
