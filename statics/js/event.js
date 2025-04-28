/**
 * Event system for the Ottoman Empire game
 */

const events = {
    /**
     * Initialize events module
     */
    init: function() {
        this.activeEvents = [];
        this.eventHistory = [];
        this.eventProbability = 0.3; // Base probability of event occurring
        this.disasters = {
            active: [],
            risk: 0,
            preparedness: 100,
            preventionLevel: 0,
            recoverySpeed: 1,
            disasterHistory: [],
            emergencyResources: {
                food: 1000,
                medicine: 500,
                emergency_funds: 2000
            }
        };
    },

    /**
     * Check for random events
     * @param {string} difficulty - Game difficulty
     * @returns {Object|null} - Event object or null if no event occurs
     */
    checkForEvents: function(difficulty) {
        // Adjust probability based on difficulty
        let adjustedProbability = this.eventProbability;
        if (difficulty === 'hard') {
            adjustedProbability += 0.2;
        } else if (difficulty === 'easy') {
            adjustedProbability -= 0.1;
        }

        // Check if event occurs
        if (Math.random() < adjustedProbability) {
            return this.generateRandomEvent(difficulty);
        }

        return null;
    },

    /**
     * Generate a random event
     * @param {string} difficulty - Game difficulty
     * @returns {Object} - Event object
     */
    generateRandomEvent: function(difficulty) {
        const eventTypes = [
            {
                id: 'drought',
                title: 'Kuraklık',
                description: 'Uzun süredir yağmur yağmıyor ve kuraklık tarımı etkiliyor. Halk susuzluk çekiyor.',
                choices: [
                    {
                        text: 'Su kanalları inşa et (300 Akçe, 200 Malzeme)',
                        cost: { money: 300, materials: 200 },
                        effects: { happiness: 10 }
                    },
                    {
                        text: 'Halkı sabretmeye davet et',
                        cost: {},
                        effects: { happiness: -15 }
                    },
                    {
                        text: 'Başka bölgelerden su getirt (500 Akçe)',
                        cost: { money: 500 },
                        effects: { happiness: 5 }
                    }
                ]
            },
            {
                id: 'plague',
                title: 'Salgın Hastalık',
                description: 'Şehirde bir salgın hastalık başladı. Halk arasında korku ve panik var.',
                choices: [
                    {
                        text: 'Hekim sayısını artır (400 Akçe, 10 İşçi)',
                        cost: { money: 400, workers: 10 },
                        effects: { happiness: 5 }
                    },
                    {
                        text: 'Şehri karantinaya al',
                        cost: {},
                        effects: { happiness: -10, money: -200 }
                    },
                    {
                        text: 'Dua ve sadaka ile ilahi yardım iste',
                        cost: { money: 200 },
                        effects: { happiness: -5 }
                    }
                ]
            },
            {
                id: 'war',
                title: 'Savaş Hazırlıkları',
                description: 'İmparatorluk yeni bir sefere hazırlanıyor. Ordu için kaynak ve destek gerekli.',
                warSupport: 0,
                warNegativeSupport: 0,
                choices: [
                    {
                        text: 'Tam destek sağla (500 Akçe, 300 Malzeme, 30 İşçi)',
                        cost: { money: 500, materials: 300, workers: 30 },
                        effects: { prestige: 20, happiness: -5, warSupport: 2 }
                    },
                    {
                        text: 'Kısmi destek ver (250 Akçe, 150 Malzeme)',
                        cost: { money: 250, materials: 150 },
                        effects: { prestige: 5, happiness: 0, warSupport: 1 }
                    },
                    {
                        text: 'Savaşa karşı olduğunu bildir',
                        cost: {},
                        effects: { prestige: -15, happiness: 10, warSupport: -1,
                            gameOver: {
                                chance: 0.4,
                                message: "Düşman orduları zayıf savunmamızı fark etti ve şehrimizi fethetti! Vakıf yönetiminde başarısız oldunuz."
                            }
                        }
                    }
                ]
            },
            {
                id: 'enemy_attack',
                title: 'Düşman Saldırısı',
                description: 'Düşman ordusu sınırlarımıza dayandı! Savunma hazırlıkları yapılmalı.',
                defenseSupportCount: 0,
                choices: [
                    {
                        text: 'Tüm orduyu seferber et (1000 Akçe, 50 İşçi)',
                        cost: { money: 1000, workers: 50 },
                        effects: { prestige: 20, happiness: -10, defenseSupport: 2 }
                    },
                    {
                        text: 'Diplomatik çözüm ara (500 Akçe)',
                        cost: { money: 500 },
                        effects: { prestige: -5, happiness: 5, defenseSupport: -1,
                            gameOver: {
                                chance: 0.3,
                                message: "Diplomatik çözüm başarısız oldu ve savunmamız yetersiz kaldı. Şehir düştü!"
                            }
                        }
                    }
                ]
            },
            {
                id: 'rebellion',
                title: 'Halk Ayaklanması',
                description: 'Vergilerin yüksekliği ve çeşitli sorunlar nedeniyle halk arasında huzursuzluk başladı.',
                stabilityCount: 0,
                choices: [
                    {
                        text: 'Şikayetleri dinle ve reformlar yap (300 Akçe)',
                        cost: { money: 300 },
                        effects: { happiness: 20, prestige: 5, stability: 2 }
                    },
                    {
                        text: 'Askeri güç kullan',
                        cost: { workers: 20 },
                        effects: { happiness: -20, prestige: -10, stability: -1,
                            gameOver: {
                                chance: 0.35,
                                message: "Halk ayaklanması kontrolden çıktı! Vakıf yönetimi devrildi."
                            }
                        }
                    },
                    {
                        text: 'Vergileri geçici olarak düşür (200 Akçe kaybı)',
                        cost: {},
                        effects: { money: -200, happiness: 15, stability: 1 }
                    }
                ]
            },
            {
                id: 'festival',
                title: 'Şehir Festivali',
                description: 'Padişahın doğum günü veya önemli bir zafer için kutlama yapılabilir.',
                choices: [
                    {
                        text: 'Büyük bir şenlik düzenle (400 Akçe, 100 Malzeme)',
                        cost: { money: 400, materials: 100 },
                        effects: { happiness: 20, prestige: 10 }
                    },
                    {
                        text: 'Mütevazı bir kutlama yap (150 Akçe)',
                        cost: { money: 150 },
                        effects: { happiness: 10, prestige: 5 }
                    },
                    {
                        text: 'Kutlama yapma, kaynakları koru',
                        cost: {},
                        effects: { happiness: -5, prestige: -5 }
                    }
                ]
            },
            {
                id: 'trade',
                title: 'Ticaret Fırsatı',
                description: 'Yabancı tüccarlar şehrinize geldi ve özel bir ticaret anlaşması teklif ediyor.',
                choices: [
                    {
                        text: 'Anlaşmayı kabul et (200 Malzeme)',
                        cost: { materials: 200 },
                        effects: { money: 500, prestige: 5 }
                    },
                    {
                        text: 'Daha iyi şartlar için pazarlık et',
                        cost: {},
                        effects: { money: 300, prestige: 0 }
                    },
                    {
                        text: 'Teklifi reddet, yerli tüccarları koru',
                        cost: {},
                        effects: { happiness: 5, prestige: -5 }
                    }
                ]
            },
            {
                id: 'royal_visit',
                title: 'Padişah Ziyareti',
                description: 'Padişah şehrinizi ziyaret etmeyi planlıyor. Büyük bir onur ama aynı zamanda büyük hazırlıklar gerektiriyor.',
                choices: [
                    {
                        text: 'İhtişamlı bir karşılama hazırla (600 Akçe, 300 Malzeme)',
                        cost: { money: 600, materials: 300 },
                        effects: { prestige: 25, happiness: 15 }
                    },
                    {
                        text: 'Saygılı ama mütevazı bir karşılama (300 Akçe, 150 Malzeme)',
                        cost: { money: 300, materials: 150 },
                        effects: { prestige: 10, happiness: 5 }
                    },
                    {
                        text: 'Ziyareti ertelemeyi rica et',
                        cost: {},
                        effects: { prestige: -20, happiness: 0 }
                    }
                ]
            },
            {
                id: 'discovery',
                title: 'Tarihi Keşif',
                description: 'Şehrinizde yapılan kazılarda tarihi bir eser bulundu. Bu keşif büyük ilgi çekiyor.',
                choices: [
                    {
                        text: 'Müze inşa et ve eseri sergile (500 Akçe, 300 Malzeme)',
                        cost: { money: 500, materials: 300 },
                        effects: { prestige: 15, happiness: 10 }
                    },
                    {
                        text: 'Eseri sarayın hazinesine gönder',
                        cost: {},
                        effects: { prestige: 5, happiness: -5 }
                    },
                    {
                        text: 'Eseri yüksek fiyata sat (300 Akçe kazanç)',
                        cost: {},
                        effects: { money: 300, prestige: -10 }
                    }
                ]
            },
            {
                id: 'rebellion',
                title: 'Halk Ayaklanması',
                description: 'Vergilerin yüksekliği ve çeşitli sorunlar nedeniyle halk arasında huzursuzluk başladı.',
                choices: [
                    {
                        text: 'Şikayetleri dinle ve reformlar yap (300 Akçe)',
                        cost: { money: 300 },
                        effects: { happiness: 20, prestige: 5 }
                    },
                    {
                        text: 'Askeri güç kullan',
                        cost: { workers: 20 },
                        effects: { happiness: -20, prestige: -10 }
                    },
                    {
                        text: 'Vergileri geçici olarak düşür (200 Akçe kaybı)',
                        cost: {},
                        effects: { money: -200, happiness: 15 }
                    }
                ]
            },
            {
                id: 'foreign_diplomat',
                title: 'Yabancı Diplomat',
                description: 'Önemli bir yabancı ülkeden bir diplomat şehrinizi ziyaret ediyor. Diplomatik ilişkileriniz oyununuzun gidişatını etkileyebilir.',
                diplomaticContext: {
                    relationshipLevel: utils.randomInt(0, 100),
                    potentialAlliance: Math.random() > 0.7,
                    tradeBenefits: utils.randomInt(100, 1000),
                    culturalExchange: Math.random() > 0.5
                },
                choices: [
                    {
                        text: 'Şerefine büyük bir ziyafet düzenle (400 Akçe)',
                        cost: { money: 400 },
                        effects: { prestige: 15, happiness: 5, relationship: 10 }
                    },
                    {
                        text: 'Resmi bir karşılama yeterli',
                        cost: { money: 100 },
                        effects: { prestige: 5, happiness: 0, relationship: 5 }
                    },
                    {
                        text: 'Diplomatı görmezden gel',
                        cost: {},
                        effects: { prestige: -15, happiness: 0, relationship: -10 }
                    }
                ]
            },
            {
                id: 'good_harvest',
                title: 'Bereketli Hasat',
                description: 'Bu yıl hasat beklenenden çok daha iyi oldu. Bolluğun nasıl değerlendirileceğine karar vermelisiniz.',
                choices: [
                    {
                        text: 'Fakirlere dağıt',
                        cost: {},
                        effects: { happiness: 25, prestige: 10 }
                    },
                    {
                        text: 'Depola ve sat (500 Akçe kazanç)',
                        cost: {},
                        effects: { money: 500, happiness: -5 }
                    },
                    {
                        text: 'Gelecek için stokla (200 Malzeme kazanç)',
                        cost: {},
                        effects: { materials: 200, happiness: 5 }
                    }
                ]
            },
            {
                id: 'enemy_attack',
                title: 'Düşman Saldırısı',
                description: 'Düşman ordusu sınırlarımıza dayandı! Savunma hazırlıkları yapılmalı.',
                choices: [
                    {
                        text: 'Tüm orduyu seferber et (1000 Akçe, 50 İşçi)',
                        cost: { money: 1000, workers: 50 },
                        effects: { prestige: 20, happiness: -10 }
                    },
                    {
                        text: 'Diplomatik çözüm ara (500 Akçe)',
                        cost: { money: 500 },
                        effects: { prestige: -5, happiness: 5 }
                    }
                ]
            },
            {
                id: 'market_crash',
                title: 'Pazar Çöküşü',
                description: 'Ticaret yollarındaki sorunlar nedeniyle ekonomi sarsıldı!',
                choices: [
                    {
                        text: 'Piyasaya para pompa (800 Akçe)',
                        cost: { money: 800 },
                        effects: { happiness: 15, prestige: 5 }
                    },
                    {
                        text: 'Yeni ticaret rotaları bul',
                        cost: { materials: 300 },
                        effects: { money: 1000, prestige: 10 }
                    }
                ]
            }
        ];

        // Select random event
        const eventType = eventTypes[utils.randomInt(0, eventTypes.length - 1)];

        // Adjust difficulty
        if (difficulty === 'hard') {
            // Make costs higher and effects lower
            eventType.choices.forEach(choice => {
                if (choice.cost.money) choice.cost.money = Math.round(choice.cost.money * 1.3);
                if (choice.cost.materials) choice.cost.materials = Math.round(choice.cost.materials * 1.3);
                if (choice.cost.workers) choice.cost.workers = Math.round(choice.cost.workers * 1.3);

                if (choice.effects.happiness > 0) choice.effects.happiness = Math.round(choice.effects.happiness * 0.8);
                if (choice.effects.happiness < 0) choice.effects.happiness = Math.round(choice.effects.happiness * 1.2);
                if (choice.effects.prestige > 0) choice.effects.prestige = Math.round(choice.effects.prestige * 0.8);
                if (choice.effects.prestige < 0) choice.effects.prestige = Math.round(choice.effects.prestige * 1.2);
                if (choice.effects.money > 0) choice.effects.money = Math.round(choice.effects.money * 0.8);
                if (choice.effects.money < 0) choice.effects.money = Math.round(choice.effects.money * 1.2);
            });
        } else if (difficulty === 'easy') {
            // Make costs lower and effects higher
            eventType.choices.forEach(choice => {
                if (choice.cost.money) choice.cost.money = Math.round(choice.cost.money * 0.7);
                if (choice.cost.materials) choice.cost.materials = Math.round(choice.cost.materials * 0.7);
                if (choice.cost.workers) choice.cost.workers = Math.round(choice.cost.workers * 0.7);

                if (choice.effects.happiness > 0) choice.effects.happiness = Math.round(choice.effects.happiness * 1.2);
                if (choice.effects.happiness < 0) choice.effects.happiness = Math.round(choice.effects.happiness * 0.8);
                if (choice.effects.prestige > 0) choice.effects.prestige = Math.round(choice.effects.prestige * 1.2);
                if (choice.effects.prestige < 0) choice.effects.prestige = Math.round(choice.effects.prestige * 0.8);
                if (choice.effects.money > 0) choice.effects.money = Math.round(choice.effects.money * 1.2);
                if (choice.effects.money < 0) choice.effects.money = Math.round(choice.effects.money * 0.8);
            });
        }

        // Create event object
        const event = {
            id: eventType.id + '_' + Date.now(),
            type: eventType.id,
            title: eventType.title,
            description: eventType.description,
            choices: eventType.choices,
            timeCreated: Date.now(),
            isActive: true
        };

        // Add to active events
        this.activeEvents.push(event);

        utils.log(`<span style="color:#ff9800">⚠</span> Yeni olay: <strong>${event.title}</strong>`);

        return event;
    },

    /**
     * Handle event choice
     * @param {string} eventId - Event ID
     * @param {number} choiceIndex - Index of the selected choice
     * @param {Object} gameResources - Player resources
     * @returns {Object} - Result object with success flag and effects
     */
    handleEventChoice: function(eventId, choiceIndex, gameResources) {
        // Find event
        const eventIndex = this.activeEvents.findIndex(event => event.id === eventId);
        if (eventIndex === -1) {
            return { success: false, message: 'Olay bulunamadı' };
        }

        const currentEvent = this.activeEvents[eventIndex];
        const choice = currentEvent.choices[choiceIndex];

        // Support tracking for different event types
        if (currentEvent.id === 'war') {
            currentEvent.warNegativeSupport = (currentEvent.warNegativeSupport || 0) + (choice.effects.warSupport < 0 ? 1 : 0);

            if (currentEvent.warNegativeSupport >= 3) {
                this.showGameOver("Sürekli savaştan kaçınmanız sonucu ordumuz zayıfladı ve düşman güçleri şehri ele geçirdi!");
                return { success: true, gameOver: true };
            }
        }
        else if (currentEvent.id === 'enemy_attack') {
            currentEvent.defenseSupportCount = (currentEvent.defenseSupportCount || 0) + (choice.effects.defenseSupport || 0);

            if (currentEvent.defenseSupportCount <= -2) {
                this.showGameOver("Savunma hazırlıklarının yetersizliği nedeniyle şehir düşman eline geçti!");
                return { success: true, gameOver: true };
            }
        }
        else if (currentEvent.id === 'rebellion') {
            currentEvent.stabilityCount = (currentEvent.stabilityCount || 0) + (choice.effects.stability || 0);

            if (currentEvent.stabilityCount <= -2) {
                this.showGameOver("İsyanı bastırmakta başarısız oldunuz! Vakıf yönetimi devrildi.");
                return { success: true, gameOver: true };
            }
        }

        // Check for immediate game over condition
        if (choice.effects.gameOver) {
            if (Math.random() < choice.effects.gameOver.chance) {
                this.showGameOver(choice.effects.gameOver.message);
                return { success: true, gameOver: true };
            }
        }


        // Check if player can afford choice
        if (!utils.canAfford(choice.cost, gameResources)) {
            return { success: false, message: 'Bu seçim için yeterli kaynağınız yok' };
        }

        // Apply costs
        utils.payCosts(choice.cost, gameResources);

        // Apply effects
        const effects = {};

        if (choice.effects.happiness) {
            gameResources.happiness += choice.effects.happiness;
            effects.happiness = choice.effects.happiness;
        }

        if (choice.effects.prestige) {
            gameResources.prestige += choice.effects.prestige;
            effects.prestige = choice.effects.prestige;
        }

        if (choice.effects.money) {
            gameResources.money += choice.effects.money;
            effects.money = choice.effects.money;
        }

        if (choice.effects.materials) {
            gameResources.materials += choice.effects.materials;
            effects.materials = choice.effects.materials;
        }

        if (choice.effects.workers) {
            gameResources.workers += choice.effects.workers;
            effects.workers = choice.effects.workers;
        }

        if (choice.effects.relationship) {
            gameResources.relationship += choice.effects.relationship;
            effects.relationship = choice.effects.relationship;
        }

        // Update resources display
        utils.updateResource('money', gameResources.money);
        utils.updateResource('materials', gameResources.materials);
        utils.updateResource('workers', gameResources.workers);
        utils.updateResource('relationship', gameResources.relationship);

        // Mark event as resolved and move to history
        currentEvent.isActive = false;
        currentEvent.resolvedChoice = choiceIndex;
        currentEvent.resolvedTime = Date.now();

        this.activeEvents.splice(eventIndex, 1);
        this.eventHistory.push(currentEvent);

        utils.log(`<strong>${currentEvent.title}</strong> olayı çözüldü.`);

        return { success: true, effects: effects };
    },

    /**
     * Show game over modal
     * @param {string} message - Game over message
     */
    showGameOver: function(message) {
        const gameOverModal = document.createElement('div');
        gameOverModal.className = 'modal';
        gameOverModal.id = 'game-over-modal';
        gameOverModal.innerHTML = `
            <div class="modal-content">
                <h2>Oyun Sona Erdi</h2>
                <p>${message}</p>
                <button onclick="resetGame(); document.body.removeChild(document.getElementById('game-over-modal'));">Yeniden Başla</button>
            </div>
        `;
        document.body.appendChild(gameOverModal);
        utils.showModal('game-over-modal');
        gameState.gameStarted = false;
    },

    /**
     * Get all active events
     * @returns {Array} - Array of active event objects
     */
    getActiveEvents: function() {
        return this.activeEvents;
    },

    /**
     * Get event history
     * @returns {Array} - Array of resolved event objects
     */
    getEventHistory: function() {
        return this.eventHistory;
    },

    /**
     * Render active events to container
     * @param {HTMLElement} container - Container element
     * @param {Object} gameResources - Player resources
     * @param {Function} onChoiceSelect - Callback when a choice is selected
     */
    renderEvents: function(container, gameResources, onChoiceSelect) {
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Sort events by creation time (newest first)
        const sortedEvents = [...this.activeEvents].sort((a, b) => b.timeCreated - a.timeCreated);

        if (sortedEvents.length === 0) {
            container.innerHTML = '<p>Şu anda aktif bir olay yok.</p>';
            return;
        }

        // Render events
        sortedEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';

            // Create HTML for choices
            let choicesHTML = '<div class="event-choices">';
            event.choices.forEach((choice, index) => {
                const canAfford = utils.canAfford(choice.cost, gameResources);

                // Build cost text
                let costText = '';
                if (choice.cost.money) costText += `${utils.formatNumber(choice.cost.money)} Akçe `;
                if (choice.cost.materials) costText += `${utils.formatNumber(choice.cost.materials)} Malzeme `;
                if (choice.cost.workers) costText += `${utils.formatNumber(choice.cost.workers)} İşçi `;

                choicesHTML += `
                    <div class="event-choice ${canAfford ? '' : 'disabled'}" data-event="${event.id}" data-choice="${index}">
                        <div>${choice.text}</div>
                        ${costText ? `<div><small>Maliyet: ${costText}</small></div>` : ''}
                        ${!canAfford ? '<div style="color:#d32f2f;font-size:12px;">Yeterli kaynak yok</div>' : ''}
                    </div>
                `;
            });
            choicesHTML += '</div>';

            eventElement.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
                ${choicesHTML}
            `;

            // Add event listeners to choices
            const choiceElements = eventElement.querySelectorAll('.event-choice:not(.disabled)');
            choiceElements.forEach(choiceElement => {
                choiceElement.addEventListener('click', () => {
                    const eventId = choiceElement.getAttribute('data-event');
                    const choiceIndex = parseInt(choiceElement.getAttribute('data-choice'));
                    onChoiceSelect(eventId, choiceIndex);
                });
            });

            container.appendChild(eventElement);
        });
    }
};