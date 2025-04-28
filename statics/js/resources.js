/**
 * Resource management for the Ottoman Empire game
 */

const resources = {
    /**
     * Initialize resources based on difficulty
     * @param {string} difficulty - Game difficulty
     * @returns {Object} - Initial resources
     */
    init: function(difficulty) {
        // Base resources
        let initialResources = {
            money: 1000,
            materials: 500,
            workers: 50,
            happiness: 50,
            prestige: 20,
            economy: {
                inflation: 0
            }
        };

        // Adjust based on difficulty
        switch (difficulty) {
            case 'easy':
                initialResources.money *= 1.5;
                initialResources.materials *= 1.5;
                initialResources.workers *= 1.2;
                initialResources.happiness += 20;
                break;
            case 'medium':
                // Default values
                break;
            case 'hard':
                initialResources.money *= 0.7;
                initialResources.materials *= 0.7;
                initialResources.workers *= 0.8;
                initialResources.happiness -= 10;
                break;
        }

        // Round values
        initialResources.money = Math.round(initialResources.money);
        initialResources.materials = Math.round(initialResources.materials);
        initialResources.workers = Math.round(initialResources.workers);

        // Create happiness and turn display elements if they don't exist
        this.createResourceDisplays();

        return initialResources;
    },

    /**
     * Create additional resource displays
     */
    createResourceDisplays: function() {
        // Create turn display if it doesn't exist
        if (!document.getElementById('turn-display')) {
            const resourcesContainer = document.querySelector('.resources');
            if (resourcesContainer) {
                const turnDisplay = document.createElement('div');
                turnDisplay.id = 'turn-display';
                turnDisplay.className = 'turn-display';
                turnDisplay.textContent = 'Tur: 1';
                resourcesContainer.appendChild(turnDisplay);
            }
        }

        // Create happiness display if it doesn't exist
        if (!document.getElementById('happiness-container')) {
            const resourcesContainer = document.querySelector('.resources');
            if (resourcesContainer) {
                const happinessContainer = document.createElement('div');
                happinessContainer.id = 'happiness-container';
                happinessContainer.className = 'happiness-display';

                const happinessLabel = document.createElement('span');
                happinessLabel.innerHTML = '<i class="fas fa-smile"></i>';
                happinessLabel.title = 'Halk Mutluluğu';

                const happinessMeter = document.createElement('div');
                happinessMeter.className = 'happiness-meter';

                const happinessValue = document.createElement('div');
                happinessValue.id = 'happiness-value';
                happinessValue.className = 'happiness-value';
                happinessValue.style.width = '60%';

                happinessMeter.appendChild(happinessValue);
                happinessContainer.appendChild(happinessLabel);
                happinessContainer.appendChild(happinessMeter);

                resourcesContainer.appendChild(happinessContainer);
            }
        }

        // Create prestige display if it doesn't exist
        if (!document.getElementById('prestige-container')) {
            const resourcesContainer = document.querySelector('.resources');
            if (resourcesContainer) {
                const prestigeContainer = document.createElement('div');
                prestigeContainer.id = 'prestige-container';
                prestigeContainer.className = 'prestige-display';

                const prestigeLabel = document.createElement('span');
                prestigeLabel.innerHTML = '<i class="fas fa-star"></i>';
                prestigeLabel.title = 'İtibar';

                const prestigeMeter = document.createElement('div');
                prestigeMeter.className = 'prestige-meter';

                const prestigeValue = document.createElement('div');
                prestigeValue.id = 'prestige-value';
                prestigeValue.className = 'prestige-value';
                prestigeValue.style.width = '20%';

                prestigeMeter.appendChild(prestigeValue);
                prestigeContainer.appendChild(prestigeLabel);
                prestigeContainer.appendChild(prestigeMeter);

                resourcesContainer.appendChild(prestigeContainer);
            }
        }
    },

    /**
     * Update resources display
     * @param {Object} resources - Player resources
     */
    updateDisplay: function(resources) {
        utils.updateResource('money', resources.money);
        utils.updateResource('materials', resources.materials);
        utils.updateResource('workers', resources.workers);

        // Update happiness display if it exists
        if (resources.happiness !== undefined) {
            const happinessElement = document.getElementById('happiness-value');
            if (happinessElement) {
                const percentage = Math.min(100, Math.max(0, resources.happiness));
                happinessElement.style.width = percentage + '%';
                happinessElement.parentElement.title = `Halk Mutluluğu: ${percentage}%`;

                // Update color based on happiness level
                if (percentage < 30) {
                    happinessElement.style.backgroundColor = '#d32f2f'; // Red
                } else if (percentage < 60) {
                    happinessElement.style.backgroundColor = '#ff9800'; // Orange
                } else {
                    happinessElement.style.backgroundColor = '#4caf50'; // Green
                }
            }
        }

        // Update prestige display if it exists
        if (resources.prestige !== undefined) {
            const prestigeElement = document.getElementById('prestige-value');
            if (prestigeElement) {
                const percentage = Math.min(100, Math.max(0, resources.prestige));
                prestigeElement.style.width = percentage + '%';
                prestigeElement.parentElement.title = `İtibar: ${percentage}%`;

                // Update color based on prestige level
                if (percentage < 30) {
                    prestigeElement.style.backgroundColor = '#673ab7'; // Purple
                } else if (percentage < 60) {
                    prestigeElement.style.backgroundColor = '#3f51b5'; // Indigo
                } else {
                    prestigeElement.style.backgroundColor = '#2196f3'; // Blue
                }
            }
        }

        // Update turn display
        const turnElement = document.getElementById('turn-display');
        if (turnElement && gameState) {
            turnElement.textContent = `Tur: ${gameState.turn}`;
        }
    },

    /**
     * Collect resources from cities
     * @param {Array} cities - Array of city objects
     * @param {Object} gameResources - Player resources
     * @param {number} successFactor - Success factor for resource collection (0.0-1.0)
     * @returns {Object} - Updated resources
     */
    collectResources: function(cities, gameResources, successFactor = 1.0) {
        let totalIncome = 0;
        let totalMaterials = 0;
        let totalWorkers = 0;

        // Zorluk katsayısı - geliri azaltmak için
        const difficultyMultiplier = {
            'easy': 0.8,
            'medium': 0.6,
            'hard': 0.5
        }[gameState.difficulty] || 0.6;

        // Başarı faktörü ile çarpı gelir etkinliği (vergi kaçırma vs. nedeniyle)
        const effectiveFactor = successFactor * difficultyMultiplier;

        cities.forEach(city => {
            // Vakıf gelirlerini hesapla
        let waqfIncome = Math.round(city.population * 0.001 * (city.prosperity / 100) * effectiveFactor);
        
        // Bağışlar ve vakıf gelirleri
        let charityIncome = Math.round(city.population * 0.0005 * (gameResources.prestige / 100) * effectiveFactor);
        
        // Toplam gelir
        let baseIncome = waqfIncome + charityIncome;

        // Vakıf malzeme üretimi
        let baseMaterials = Math.round(city.population * 0.0002 * (city.resources.production / 10) * effectiveFactor);

        // Vakıf sisteminin etkinliğine göre bonus
        if (gameResources.prestige > 70) {
            baseIncome *= 1.2; // Yüksek itibarlı vakıflar daha fazla bağış alır
            utils.log(`<span style="color: #4caf50">✓</span> Vakfınızın yüksek itibarı sayesinde bağışlar arttı!`);
        }

            // Base worker increase - çok daha düşük
            const baseWorkers = Math.round(city.population * 0.00001 * effectiveFactor);

            // Bakım maliyetini hesapla (şehir başına)
            let maintenanceCost = Math.round(city.population * 0.0001 * (city.buildings.length + 1));

            // İtibar yüksekse bakım maliyeti daha düşük olur (daha iyi yönetim)
            if (gameResources.prestige > 50) {
                maintenanceCost = Math.round(maintenanceCost * 0.8);
            }

            // Add building benefits with expanded economic factors
            const benefits = buildings.calculateCityBenefits(city);

            // Calculate advanced economic factors
            const marketDemand = Math.min(1.5, Math.max(0.5, 1 + (city.prosperity - 50) / 100));
            const tradePower = Math.min(1.3, Math.max(0.7, 1 + (gameResources.prestige - 50) / 200));
            const economicStability = Math.min(1.2, Math.max(0.8, 1 - gameResources.economy.inflation / 100));

            // Apply economic multipliers
            baseIncome *= marketDemand * tradePower * economicStability;
            baseMaterials *= marketDemand * economicStability;

            // Add to total (bakım maliyetini düş)
            totalIncome += baseIncome + benefits.income - maintenanceCost;
            totalMaterials += baseMaterials;
            totalWorkers += baseWorkers;

            // Eğer bakım maliyeti çok yüksekse ve negatif gelir oluşuyorsa bunu logla
            if (baseIncome + benefits.income - maintenanceCost < 0) {
                utils.log(`<span style="color: orange">⚠</span> <strong>${city.name}</strong> şehrinde yüksek bakım maliyetleri nedeniyle zarar ediyorsunuz.`);
            }

            // Şehir durumunun genel dökümünü yap
            const citySummary = `
                <div class="city-summary">
                    <div><strong>Şehir:</strong> ${city.name}</div>
                    <div><strong>Nüfus:</strong> ${utils.formatNumber(city.population)}</div>
                    <div><strong>Refah:</strong> ${city.prosperity}</div>
                    <div><strong>Bina Sayısı:</strong> ${city.buildings.length}</div>
                    <div><strong>Gelir:</strong> ${utils.formatNumber(baseIncome + benefits.income - maintenanceCost)} Akçe</div>
                    <div><strong>Bakım Maliyeti:</strong> ${utils.formatNumber(maintenanceCost)} Akçe</div>
                </div>
            `;

            // Detaylı kaynak toplamada şehirleri de gösterelim
            if (Math.random() < 0.3) { // Her seferinde değil, bazen gösterelim
                utils.log(`<details><summary><strong>${city.name}</strong> şehri özeti</summary>${citySummary}</details>`);
            }
        });

        // Negatif değerlere karşı koruma
        totalIncome = Math.max(totalIncome, -gameResources.money * 0.5); // En fazla mevcut paranın yarısını kaybedebilirsin
        totalMaterials = Math.max(totalMaterials, 0);
        totalWorkers = Math.max(totalWorkers, 0);

        // Başarı faktörü 0.8'den düşükse, kaynak kayıpları yaşanır
        if (successFactor < 0.8) {
            const lossMessage = `<span style="color: #d32f2f">⚠</span> Düşük itibar ve halk memnuniyeti nedeniyle kaynaklar verimli toplanamıyor. Normalde elde edeceğinizin yaklaşık ${Math.round(successFactor * 100)}% kadarını alabildiniz.`;
            utils.log(lossMessage);
        }

        // Update resources
        gameResources.money += totalIncome;
        gameResources.materials += totalMaterials;
        gameResources.workers += totalWorkers;

        // Prestij azaltma ihtimali (zaman geçtikçe prestij azalır)
        if (Math.random() < 0.3 && gameResources.prestige > 0) {
            gameResources.prestige -= 1;
            utils.log(`<span style="color: purple">⚠</span> Saray nezdinde itibarınızda hafif bir düşüş oldu. Yeni projeler gerçekleştirerek itibarınızı yükseltebilirsiniz.`);
        }

        // Log collection
        utils.log(`Kaynaklar toplandı: <strong>${utils.formatNumber(totalIncome)}</strong> Akçe, <strong>${utils.formatNumber(totalMaterials)}</strong> Malzeme, <strong>${utils.formatNumber(totalWorkers)}</strong> İşçi`);

        // Update display
        this.updateDisplay(gameResources);

        return gameResources;
    },

    /**
     * Apply maintenance costs for all cities
     * @param {Array} cities - Array of city objects
     * @param {Object} gameResources - Player resources
     * @returns {Object} - Updated resources
     */
    applyMaintenanceCosts: function(cities, gameResources) {
        cities.forEach(city => {
            // Update building maintenance
            buildings.updateBuildingMaintenance(city, gameResources);
        });

        // Update display
        this.updateDisplay(gameResources);

        return gameResources;
    },

    /**
     * Check if player has enough resources
     * @param {Object} cost - Cost object with money, materials, and workers properties
     * @param {Object} gameResources - Player resources
     * @returns {boolean} - True if player has enough resources
     */
    hasEnoughResources: function(cost, gameResources) {
        return utils.canAfford(cost, gameResources);
    },

    /**
     * Pay costs
     * @param {Object} cost - Cost object with money, materials, and workers properties
     * @param {Object} gameResources - Player resources
     * @returns {Object} - Updated resources
     */
    payCosts: function(cost, gameResources) {
        utils.payCosts(cost, gameResources);
        return gameResources;
    },

    /**
     * Handle fulfilling a citizen need
     * @param {Object} need - Need object
     * @param {Object} gameResources - Player resources
     * @returns {Object} - Updated resources with rewards
     */
    fulfillNeed: function(need, gameResources) {
        // Check if can afford cost
        if (!this.hasEnoughResources(need.cost, gameResources)) {
            return gameResources;
        }

        // Pay costs
        this.payCosts(need.cost, gameResources);

        // Add rewards
        if (need.rewards) {
            if (need.rewards.money) {
                gameResources.money += need.rewards.money;
            }
            if (need.rewards.materials) {
                gameResources.materials += need.rewards.materials;
            }
            if (need.rewards.workers) {
                gameResources.workers += need.rewards.workers;
            }
            if (need.rewards.happiness) {
                gameResources.happiness += need.rewards.happiness;
            }
            if (need.rewards.prestige) {
                gameResources.prestige += need.rewards.prestige;
            }
        }

        // Update display
        this.updateDisplay(gameResources);

        return gameResources;
    }
};