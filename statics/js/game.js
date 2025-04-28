/**
 * Main game logic for the Ottoman Empire game
 */

// Game state
let gameState = {
    difficulty: 'medium',
    turn: 1,
    resources: {},
    cities: [],
    selectedCity: null,
    needsGenerated: false,
    eventChecked: false,
    gameStarted: false,
    tutorialCompleted: false,
    resourcesCollectedThisTurn: false,
    happinessReductionPerCollection: 8,
    loginRequired: true,
    // Yeni özellikler
    army: {
        infantry: 0,
        cavalry: 0,
        artillery: 0,
        janissaries: 0,
        sipahi: 0,
        morale: 100,
        experience: 0,
        training: 0,
        maintenance_cost: 0,
        battle_readiness: 100
    },
    diplomacy: {
        relations: {},
        treaties: [],
        activeWars: []
    },
    economy: {
        inflation: 0,
        trade: {
            imports: [],
            exports: [],
            balance: 0
        },
        marketPrices: {}
    },
    disasters: {
        active: [],
        risk: 0
    }
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    // Show start screen
    document.getElementById('start-screen').style.display = 'flex';

    // Add event listeners for difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const difficulty = this.getAttribute('data-difficulty');
            startGame(difficulty);
        });
    });

    // Add event listeners for buttons
    document.getElementById('build-btn').addEventListener('click', showBuildModal);
    document.getElementById('collect-btn').addEventListener('click', collectResources);
    document.getElementById('manage-btn').addEventListener('click', manageCities);
    document.getElementById('tutorial-btn').addEventListener('click', showTutorial);
    document.getElementById('save-game-btn').addEventListener('click', saveGame);
    document.getElementById('load-game-btn').addEventListener('click', loadGame);
    document.getElementById('reset-game-btn').addEventListener('click', resetGame);

    // Modal close buttons
    document.getElementById('close-build-modal').addEventListener('click', () => utils.hideModal('build-modal'));
    document.getElementById('close-repair-modal').addEventListener('click', () => utils.hideModal('repair-modal'));
    document.getElementById('close-idea-modal').addEventListener('click', () => utils.hideModal('idea-modal'));
    document.getElementById('close-tutorial-modal').addEventListener('click', () => utils.hideModal('tutorial-modal'));

    // Submit idea buttons
    document.getElementById('submit-idea-btn').addEventListener('click', showIdeaModal);
    document.getElementById('submit-idea-confirm-btn').addEventListener('click', submitIdea);

    // Repair confirm button
    document.getElementById('confirm-repair-btn').addEventListener('click', confirmRepair);

    // Tab navigation
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Initialize modules
    buildings.init();
    citizens.init();
    events.init();
    diplomacy.init();

    // Add event listeners for new buttons
    document.getElementById('diplomacy-btn').addEventListener('click', () => {
        document.getElementById('diplomacy-panel').style.display = 'block';
        diplomacy.render(document.getElementById('diplomacy-content'));
    });

    document.getElementById('events-btn').addEventListener('click', () => {
        document.getElementById('events-panel').style.display = 'block';
    });

    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        const diplomacyPanel = document.getElementById('diplomacy-panel');
        const eventsPanel = document.getElementById('events-panel');
        const diplomacyBtn = document.getElementById('diplomacy-btn');
        const eventsBtn = document.getElementById('events-btn');

        if (!diplomacyPanel.contains(e.target) && e.target !== diplomacyBtn) {
            diplomacyPanel.style.display = 'none';
        }

        if (!eventsPanel.contains(e.target) && e.target !== eventsBtn) {
            eventsPanel.style.display = 'none';
        }
    });

    // Check if there's a saved game
    const savedGame = utils.loadGame();
    if (savedGame) {
        document.getElementById('load-game-btn').disabled = false;
    } else {
        document.getElementById('load-game-btn').disabled = true;
    }

    // Set up tutorial next button
    document.getElementById('tutorial-next-btn').addEventListener('click', tutorialNavigation.nextStep);
});

/**
 * Start a new game
 * @param {string} difficulty - Game difficulty (easy, medium, hard)
 */
function startGame(difficulty) {
    // Hide start screen
    document.getElementById('start-screen').style.display = 'none';

    // Set difficulty
    gameState.difficulty = difficulty;

    // Initialize resources based on difficulty
    gameState.resources = resources.init(difficulty);

    // Initialize map
    gameMap.init(selectCity);

    // Set initial game state
    gameState.turn = 1;
    gameState.cities = gameMap.cities;
    gameState.gameStarted = true;
    gameState.needsGenerated = false;
    gameState.eventChecked = false;

    // Update resources display
    resources.updateDisplay(gameState.resources);

    // Generate initial needs
    generateNeeds();

    // Log game start
    utils.log(`Oyun <strong>${difficultyName(difficulty)}</strong> zorluk seviyesinde başlatıldı. Bir şehir seçin.`);

    // Check if tutorial has been completed before
    if (!gameState.tutorialCompleted) {
        // Show tutorial
        setTimeout(() => {
            showTutorial();
        }, 1000);
    }
}

/**
 * Get difficulty name in Turkish
 * @param {string} difficulty - Difficulty code
 * @returns {string} - Turkish difficulty name
 */
function difficultyName(difficulty) {
    switch (difficulty) {
        case 'easy': return 'Kolay';
        case 'medium': return 'Orta';
        case 'hard': return 'Zor';
        default: return 'Orta';
    }
}

/**
 * Handle city selection
 * @param {Object} city - Selected city
 */
function selectCity(city) {
    gameState.selectedCity = city;

    // Update city info
    updateCityInfo(city);

    // Update buildings list
    renderBuildings(city);
}

/**
 * Update city information display
 * @param {Object} city - City to display
 */
function updateCityInfo(city) {
    const cityInfoContainer = document.getElementById('city-info');
    if (!cityInfoContainer) return;

    // Calculate building effects
    const buildingEffects = buildings.calculateCityBenefits(city);

    // Update city stats with building effects (max 100)
    city.defenseLevel = Math.min(100, city.defenseLevel + (buildingEffects.defense || 0));
    city.cultural = Math.min(100, city.cultural + (buildingEffects.cultural || 0));
    city.prosperity = Math.min(100, city.prosperity + (buildingEffects.prosperity || 0));
    city.resources.production = Math.min(20, city.resources.production + (buildingEffects.production || 0));

    cityInfoContainer.innerHTML = `
        <p><strong>Nüfus:</strong> ${utils.formatNumber(city.population)}</p>
        <p><strong>Refah:</strong> ${Math.round(city.prosperity)}/100</p>
        <p><strong>Savunma:</strong> ${Math.round(city.defenseLevel)}/100</p>
        <p><strong>Kültürel Seviye:</strong> ${Math.round(city.cultural)}/100</p>
        <p><strong>Vergi Oranı:</strong> %${city.resources.taxRate}</p>
        <p><strong>Üretim Seviyesi:</strong> ${Math.round(city.resources.production)}/20</p>
        <p>${city.description}</p>
    `;
}

/**
 * Render buildings for the selected city
 * @param {Object} city - City object
 */
function renderBuildings(city) {
    buildings.renderBuildingList(
        city, 
        document.getElementById('buildings-container'),
        showRepairModal
    );
}

/**
 * Show build modal
 */
function showBuildModal() {
    const city = gameState.selectedCity;

    if (!city) {
        utils.log('İnşaat için önce bir şehir seçmelisiniz.');
        return;
    }

    const buildingOptionsContainer = document.getElementById('building-options');

    buildings.renderBuildingOptions(
        city, 
        gameState.resources, 
        buildingOptionsContainer, 
        startConstruction
    );

    utils.showModal('build-modal');
}

/**
 * Start building construction
 * @param {string} buildingTypeId - Building type ID
 */
function startConstruction(buildingTypeId) {
    const city = gameState.selectedCity;

    if (!city) {
        utils.hideModal('build-modal');
        return;
    }

    // Update city with new building
    const updatedCity = buildings.startConstruction(buildingTypeId, city, gameState.resources);

    // Update city in game state
    gameMap.updateCity(updatedCity);
    gameState.selectedCity = updatedCity;

    // Update UI
    renderBuildings(updatedCity);

    // Close modal
    utils.hideModal('build-modal');
}

/**
 * Show repair modal
 * @param {Object} building - Building to repair
 */
function showRepairModal(building) {
    const city = gameState.selectedCity;
    if (!city) return;

    const buildingType = buildings.getBuildingTypeById(building.typeId);
    if (!buildingType) return;

    // Calculate repair costs based on damage
    const damagePercent = 100 - building.condition;
    const repairCosts = {
        money: Math.ceil(buildingType.cost.money * damagePercent * 0.01 * 0.5),
        materials: Math.ceil(buildingType.cost.materials * damagePercent * 0.01 * 0.5),
        workers: Math.ceil(buildingType.cost.workers * damagePercent * 0.01 * 0.3)
    };

    // Store current building ID for repair confirmation
    gameState.currentRepairBuilding = building.id;

    // Show repair costs
    const repairCostsContainer = document.getElementById('repair-costs');
    repairCostsContainer.innerHTML = `
        <p><strong>Onarım maliyeti:</strong></p>
        <p><i class="fas fa-coins"></i> ${utils.formatNumber(repairCosts.money)} Akçe</p>
        <p><i class="fas fa-warehouse"></i> ${utils.formatNumber(repairCosts.materials)} Malzeme</p>
        <p><i class="fas fa-users"></i> ${utils.formatNumber(repairCosts.workers)} İşçi</p>
    `;

    // Disable repair button if can't afford
    const confirmButton = document.getElementById('confirm-repair-btn');
    if (!utils.canAfford(repairCosts, gameState.resources)) {
        confirmButton.disabled = true;
        confirmButton.title = 'Yeterli kaynağınız yok';
    } else {
        confirmButton.disabled = false;
        confirmButton.title = '';
    }

    utils.showModal('repair-modal');
}

/**
 * Confirm building repair
 */
function confirmRepair() {
    const city = gameState.selectedCity;
    if (!city || !gameState.currentRepairBuilding) {
        utils.hideModal('repair-modal');
        return;
    }

    // Repair building
    const updatedCity = buildings.repairBuilding(
        gameState.currentRepairBuilding, 
        city, 
        gameState.resources
    );

    // Update city in game state
    gameMap.updateCity(updatedCity);
    gameState.selectedCity = updatedCity;

    // Update UI
    renderBuildings(updatedCity);

    // Hide modal
    utils.hideModal('repair-modal');

    // Clear current repair building
    gameState.currentRepairBuilding = null;
}

/**
 * Show idea submission modal
 */
function showIdeaModal() {
    // Artık kullanıcı fikir girmiyor, otomatik fikir oluşturuluyor
    // Rastgele bir fikir oluştur
    generateAutomaticIdea();

    // Modal göstermeye gerek yok
    // Eski kodu koruyup, yeni kodu ekleyebilirsiniz
    // utils.showModal('idea-modal');
}

/**
 * Otomatik olarak fikir oluştur
 */
function generateAutomaticIdea() {
    // 1-3 arası rastgele yeni fikir oluştur
    const newIdeaCount = utils.randomInt(1, 2);
    citizens.generateRandomIdeas(newIdeaCount);

    // Render ideas
    citizens.renderIdeas(
        document.getElementById('public-ideas'),
        handleIdeaVote
    );

    // Log
    utils.log(`Halktan <strong>${newIdeaCount}</strong> yeni fikir geldi.`);

    // Fikirler sekmesine geçiş yap
    switchTab('ideas');
}

/**
 * Submit a new idea - artık kullanılmıyor
 */
function submitIdea() {
    // Halkın kendi fikirleri olduğu için bu fonksiyon artık kullanılmıyor
    generateAutomaticIdea();
    utils.hideModal('idea-modal');
}

/**
 * Handle idea voting
 * @param {string} ideaId - Idea ID
 * @param {boolean} isLike - True for like, false for dislike
 */
function handleIdeaVote(ideaId, isLike) {
    const updatedIdea = citizens.voteIdea(ideaId, isLike);

    if (updatedIdea) {
        // Render ideas
        citizens.renderIdeas(
            document.getElementById('public-ideas'),
            handleIdeaVote
        );
    }
}

/**
 * Collect resources from all cities
 */
function collectResources() {
    try {
        // Check if resources have already been collected this turn
        if (gameState.resourcesCollectedThisTurn) {
            utils.log('<span style="color: red">⚠</span> Bu turda zaten kaynak topladınız. Bir sonraki tura geçmek için "Sonraki Tur" düğmesini kullanın.');
            return;
        }

        // Zorluğa göre mutluluk düşüşü ayarla
        const difficultyPenalties = {
            'easy': 8, // Artırıldı
            'medium': 12, // Artırıldı
            'hard': 16 // Artırıldı
        };

        // Toplanan kaynak miktarı başarı faktörünü hesapla (itibar ve mutluluk etkiler)
        const successFactor = Math.min(1.0, 0.5 + (gameState.resources.happiness / 200) + (gameState.resources.prestige / 100));

        // İtibarın çok düşük olduğu durumları kontrol et (vergi kaçırma riski)
        const taxEvasionRisk = gameState.resources.prestige < 20 && gameState.resources.happiness < 30;

        // Vergi kaçırma olursa gelir azalır
        if (taxEvasionRisk && Math.random() < 0.4) {
            // Toplama öncesi itibar düşüşü (prestij)
            gameState.resources.prestige = Math.max(0, gameState.resources.prestige - 2);
            utils.log(`<span style="color: #d32f2f">⚠</span> <strong>Halk arasında vergi kaçırma yaygınlaşıyor!</strong> Düşük itibarınız ve halk memnuniyetsizliği nedeniyle vergi gelirleri azaldı.`);
        }

        // Collect resources with success factor
        gameState.resources = resources.collectResources(gameState.cities, gameState.resources, successFactor);

        // Toplama başına daha fazla mutluluk düşüşü - zorluğa göre
        const happinessPenalty = difficultyPenalties[gameState.difficulty] || 12; // Default artırıldı

        // Reduce happiness when collecting resources
        if (gameState.resources.happiness !== undefined) {
            const oldHappiness = gameState.resources.happiness;
            gameState.resources.happiness = Math.max(0, gameState.resources.happiness - happinessPenalty);

            // Mutluluk değişimini logla
            utils.log(`<span style="color: #ff9800">⚠</span> Vergi yükü nedeniyle halkın mutluluğu ${happinessPenalty} puan düştü. (${oldHappiness} → ${gameState.resources.happiness})`);

            // Mutluluk çok düşükse ek uyarı ver
            if (gameState.resources.happiness < 20) {
                utils.log(`<span style="color: #d32f2f">⚠</span> <strong>Halk huzursuzlanıyor!</strong> Mutluluk seviyesi kritik derecede düşük (${gameState.resources.happiness}). Acil önlem alın.`);
            }
        }

        // Mark resources as collected for this turn
        gameState.resourcesCollectedThisTurn = true;

        // Disable collect button until next turn
        const collectButton = document.getElementById('collect-btn');
        if (collectButton) {
            collectButton.disabled = true;
            collectButton.title = 'Bu turda zaten kaynak topladınız';
        }

        // Update UI
        resources.updateDisplay(gameState.resources);
    } catch (error) {
        console.error("Kaynak toplama hatası:", error);
        utils.log(`<span style="color: red">HATA:</span> Kaynak toplama sırasında bir sorun oluştu.`);
    }

    // Update collect button state
    const collectButton = document.getElementById('collect-btn');
    if (collectButton) {
        collectButton.disabled = true;
        collectButton.title = 'Bu turda zaten kaynak topladınız';
    }
}

function nextTurn() {
    // Check if resources have been collected this turn
    if (!gameState.resourcesCollectedThisTurn) {
        utils.log('Kaynakları toplamadan tur geçemezsiniz!', 'error');
        return;
    }

    // Update events
    events.update();

    // Update diplomacy
    Object.values(diplomacy.getRelations()).forEach(relation => {
        // Random relation changes
        if (Math.random() < 0.3) { // 30% chance
            const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
            diplomacy.changeRelation(relation.id, change);
        }

        // Apply treaty benefits
        relation.treaties.forEach(treaty => {
            if (treaty.type === 'TRADE_AGREEMENT') {
                gameState.resources.money += 50;
            } else if (treaty.type === 'MILITARY_ALLIANCE') {
                gameState.army.morale += 2;
            }
        });
    });

    // Increment turn counter
    gameState.turn++;

    // Reset flags
    gameState.needsGenerated = false;
    gameState.eventChecked = false;
    gameState.resourcesCollectedThisTurn = false;

    // Update construction progress
    gameState.cities.forEach(city => {
        buildings.updateConstruction(city);
    });

    // Apply maintenance costs with increased cost
    resources.applyMaintenanceCosts(gameState.cities, gameState.resources, 1.5); // Increased cost factor

    // Her tur otomatik mutluluk düşüşü - artırıldı
    const happinessPenalty = {
        'easy': -3, // Artırıldı
        'medium': -5, // Artırıldı
        'hard': -7 // Artırıldı
    }[gameState.difficulty] || -5;

    // Mutluluğu düşür
    gameState.resources.happiness += happinessPenalty;

    // Mutluluk değişikliğini logla
    utils.log(`<span style="color: ${happinessPenalty < 0 ? "#d32f2f" : "#4caf50"}">◆</span> Halk arasında zaman geçtikçe ${Math.abs(happinessPenalty)} birim mutluluk kaybı oldu.`);

    // Mutluluk 0 olduğunda oyun kaybedilir
    if (gameState.resources.happiness <= 0) {
        utils.log(`<span style="color: #d32f2f">⚠</span> <strong>OYUN SONA ERDİ:</strong> Halk tamamen mutsuz! Vakıf yönetiminde başarısız oldunuz.`);
        
        // Oyun sonu modalını göster
        const existingModal = document.getElementById('game-over-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        const gameOverModal = document.createElement('div');
        gameOverModal.className = 'modal';
        gameOverModal.id = 'game-over-modal';
        gameOverModal.innerHTML = `
            <div class="modal-content">
                <h2>Oyun Sona Erdi</h2>
                <p>Halkın mutluluğu sıfıra düştü. Vakıf yönetiminde başarısız oldunuz.</p>
                <p>Osmanlı vakıf sistemi, toplumun refahı ve mutluluğu için kurulmuş önemli bir kurumdur. 
                Vakıflar sayesinde camiler, medreseler, hastaneler, imarethaneler inşa edilmiş ve halkın ihtiyaçları karşılanmıştır.</p>
                <button onclick="resetGame(); document.body.removeChild(document.getElementById('game-over-modal'));">Yeniden Başla</button>
            </div>
        `;
        document.body.appendChild(gameOverModal);
        utils.showModal('game-over-modal');
        
        // Oyunu durdur
        gameState.gameStarted = false;
        return;
    }
    // Mutluluk çok düşükse isyan riski
    else if (gameState.resources.happiness < 10) {
        utils.log(`<span style="color: #d32f2f">⚠</span> <strong>DİKKAT:</strong> Halk mutluluğu çok düşük (${gameState.resources.happiness})! Acil önlem alınmazsa isyan çıkabilir!`);
    }

    // Şehirlerde nüfus değişimini hesapla
    gameState.cities.forEach(city => {
        // Mutluluk durumuna göre nüfus değişimi
        let populationGrowth = 0;

        if (gameState.resources.happiness > 80) {
            // Yüksek mutlulukta hızlı nüfus artışı
            populationGrowth = Math.round(city.population * 0.02);
        } else if (gameState.resources.happiness > 50) {
            // Normal mutlulukta orta seviye nüfus artışı
            populationGrowth = Math.round(city.population * 0.01);
        } else if (gameState.resources.happiness > 20) {
            // Düşük mutlulukta az nüfus artışı
            populationGrowth = Math.round(city.population * 0.005);
        } else {
            // Çok düşük mutlulukta nüfus azalır (göç)
            populationGrowth = Math.round(city.population * -0.01);
            utils.log(`<span style="color: orange">⚠</span> <strong>${city.name}</strong> şehrinden halk göç ediyor!`);
        }

        // Nüfusu güncelle
        city.population += populationGrowth;

        // Nüfus değişim loglaması
        if (populationGrowth !== 0) {
            const sign = populationGrowth > 0 ? '+' : '';
            utils.log(`<strong>${city.name}</strong> şehrinin nüfusu: ${sign}${utils.formatNumber(populationGrowth)} kişi (Toplam: ${utils.formatNumber(city.population)})`);
        }
    });

    // Generate new needs
    generateNeeds();

    // Check for events
    checkForEvents();

    // Update UI for selected city
    if (gameState.selectedCity) {
        const updatedCity = gameMap.getCityById(gameState.selectedCity.id);
        if (updatedCity) {
            gameState.selectedCity = updatedCity;
            renderBuildings(updatedCity);
        }
    }

    // Enable collect button
    const collectButton = document.getElementById('collect-btn');
    if (collectButton) {
        collectButton.disabled = false;
        collectButton.title = '';
    }

    // Kaynakları güncelle
    resources.updateDisplay(gameState.resources);

    // Log turn
    utils.log(`<strong>Tur ${gameState.turn}</strong> başladı.`);
}

/**
 * Manage cities (placeholder for future implementation)
 */
function manageCities() {
    const city = gameState.selectedCity;

    if (!city) {
        utils.log('Yönetim için önce bir şehir seçmelisiniz.');
        return;
    }

    utils.log(`<strong>${city.name}</strong> şehri yönetim paneli açıldı.`);

    // This function can be expanded in the future
    // For now, just show maintenance tab
    switchTab('maintenance');
}

/**
 * Switch between tabs
 * @param {string} tabName - Tab name
 */
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Add active class to selected tab button
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    updateTabContent(tabName);
}

/**
 * Update tab content
 * @param {string} tabName - Tab name
 */
function updateTabContent(tabName) {
    switch (tabName) {
        case 'needs':
            citizens.renderNeeds(
                document.getElementById('needs-container'),
                gameState.resources,
                fulfillNeed
            );
            break;
        case 'ideas':
            citizens.renderIdeas(
                document.getElementById('public-ideas'),
                handleIdeaVote
            );
            break;
        case 'events':
            events.renderEvents(
                document.getElementById('events-container'),
                gameState.resources,
                handleEventChoice
            );
            break;
        case 'maintenance':
            renderMaintenance();
            break;
    }
}

/**
 * Render maintenance tab content
 */
function renderMaintenance() {
    const container = document.getElementById('maintenance-container');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    const city = gameState.selectedCity;

    if (!city) {
        container.innerHTML = '<p>Bakım bilgilerini görmek için bir şehir seçin.</p>';
        return;
    }

    // Display city maintenance info
    container.innerHTML = `
        <h3>${city.name} Şehri Bakım Durumu</h3>
        <p>Şehir bakım maliyetleri ve durumu burada görüntülenir.</p>
        <div class="building-list">
            <h4>Yapıların Durumu</h4>
            <div id="maintenance-buildings"></div>
        </div>
    `;

    // Display buildings condition
    const buildingsContainer = document.getElementById('maintenance-buildings');

    if (city.buildings.length === 0) {
        buildingsContainer.innerHTML = '<p>Bu şehirde henüz yapı bulunmuyor.</p>';
        return;
    }

    city.buildings.forEach(building => {
        const buildingType = buildings.getBuildingTypeById(building.typeId);
        if (!buildingType) return;

        let statusClass = '';
        let statusText = '';

        if (building.status === 'construction') {
            statusText = 'İnşa Ediliyor';
        } else if (building.status === 'needs_repair') {
            statusText = 'Onarım Gerekli';
            statusClass = 'poor';
        } else {
            if (building.condition > 70) {
                statusText = 'İyi Durumda';
                statusClass = 'good';
            } else if (building.condition > 30) {
                statusText = 'Orta Durumda';
                statusClass = 'fair';
            } else {
                statusText = 'Kötü Durumda';
                statusClass = 'poor';
            }
        }

        const buildingElement = document.createElement('div');
        buildingElement.className = 'maintenance-item';

        buildingElement.innerHTML = `
            <div>
                <div class="building-name"><i class="fas fa-${buildingType.icon}"></i> ${building.name}</div>
                <div class="maintenance-status ${statusClass}">Durum: ${statusText} (${building.condition}%)</div>
                <div class="maintenance-cost">
                    Bakım Maliyeti: 
                    <span>${utils.formatNumber(buildingType.maintenance.money)} Akçe</span> | 
                    <span>${utils.formatNumber(buildingType.maintenance.materials)} Malzeme</span>
                </div>
            </div>
        `;

        // Add repair button if needed
        if (building.status === 'needs_repair') {
            const repairActions = document.createElement('div');
            repairActions.className = 'repair-actions';

            const repairBtn = document.createElement('button');
            repairBtn.className = 'repair-btn';
            repairBtn.innerHTML = '<i class="fas fa-tools"></i> Onar';
            repairBtn.onclick = () => showRepairModal(building);

            repairActions.appendChild(repairBtn);
            buildingElement.appendChild(repairActions);
        }

        buildingsContainer.appendChild(buildingElement);
    });
}

/**
 * Fulfill a citizen need
 * @param {Object} need - Need object
 */
function fulfillNeed(need) {
    // Update resources
    gameState.resources = resources.fulfillNeed(need, gameState.resources);

    // Remove need from list
    citizens.removeNeed(need.id);

    // Update needs display
    citizens.renderNeeds(
        document.getElementById('needs-container'),
        gameState.resources,
        fulfillNeed
    );

    utils.log(`<span style="color: green">✓</span> <strong>${need.title}</strong> ihtiyacı karşılandı.`);
}

/**
 * Handle event choice
 * @param {string} eventId - Event ID
 * @param {number} choiceIndex - Choice index
 */
function handleEventChoice(eventId, choiceIndex) {
    const result = events.handleEventChoice(eventId, choiceIndex, gameState.resources);

    if (result.success) {
        // Update events display
        events.renderEvents(
            document.getElementById('events-container'),
            gameState.resources,
            handleEventChoice
        );

        // Log effects
        let effectsText = '';

        if (result.effects.happiness) {
            const sign = result.effects.happiness > 0 ? '+' : '';
            effectsText += `Halk Mutluluğu: ${sign}${result.effects.happiness}, `;
        }

        if (result.effects.prestige) {
            const sign = result.effects.prestige > 0 ? '+' : '';
            effectsText += `İtibar: ${sign}${result.effects.prestige}, `;
        }

        if (result.effects.money) {
            const sign = result.effects.money > 0 ? '+' : '';
            effectsText += `Akçe: ${sign}${utils.formatNumber(result.effects.money)}, `;
        }

        if (result.effects.materials) {
            const sign = result.effects.materials > 0 ? '+' : '';
            effectsText += `Malzeme: ${sign}${utils.formatNumber(result.effects.materials)}, `;
        }

        if (result.effects.workers) {
            const sign = result.effects.workers > 0 ? '+' : '';
            effectsText += `İşçi: ${sign}${utils.formatNumber(result.effects.workers)}`;
        }

        // Remove trailing comma and space
        effectsText = effectsText.replace(/, $/, '');

        if (effectsText) {
            utils.log(`Olay sonuçları: ${effectsText}`);
        }
    }
}

/**
 * Generate new citizen needs
 */
function generateNeeds() {
    if (gameState.needsGenerated) return;

    // Generate needs
    const needs = citizens.generateNeeds(gameState.cities, gameState.difficulty);

    // Render needs
    citizens.renderNeeds(
        document.getElementById('needs-container'),
        gameState.resources,
        fulfillNeed
    );

    gameState.needsGenerated = true;
}

/**
 * Check for random events
 */
function checkForEvents() {
    if (gameState.eventChecked) return;

    // Check for events
    const newEvent = events.checkForEvents(gameState.difficulty);

    if (newEvent) {
        // Render events
        events.renderEvents(
            document.getElementById('events-container'),
            gameState.resources,
            handleEventChoice
        );

        // Switch to events tab to highlight the new event
        switchTab('events');
    }

    gameState.eventChecked = true;
}

/**
 * Save game state to local storage
 */
function saveGame() {
    if (!gameState.gameStarted) {
        utils.log('Kaydedecek oyun bulunamadı.');
        return;
    }

    const saveData = {
        difficulty: gameState.difficulty,
        turn: gameState.turn,
        resources: gameState.resources,
        cities: gameState.cities,
        selectedCityId: gameState.selectedCity ? gameState.selectedCity.id : null,
        needs: citizens.getNeeds(),
        ideas: citizens.getIdeas(),
        activeEvents: events.getActiveEvents(),
        eventHistory: events.getEventHistory(),
        tutorialCompleted: gameState.tutorialCompleted,
        savedDate: new Date().toISOString(),
        army: gameState.army,
        diplomacy: gameState.diplomacy,
        economy: gameState.economy,
        disasters: gameState.disasters
    };

    utils.saveGame(saveData);
}

/**
 * Load game state from local storage
 */
function loadGame() {
    const savedGame = utils.loadGame();

    if (!savedGame) {
        utils.log('Yüklenecek kayıtlı oyun bulunamadı.');
        return;
    }

    // Hide start screen
    document.getElementById('start-screen').style.display = 'none';

    // Restore game state
    gameState.difficulty = savedGame.difficulty;
    gameState.turn = savedGame.turn;
    gameState.resources = savedGame.resources;
    gameState.cities = savedGame.cities;
    gameState.gameStarted = true;
    gameState.tutorialCompleted = savedGame.tutorialCompleted;
    gameState.army = savedGame.army;
    gameState.diplomacy = savedGame.diplomacy;
    gameState.economy = savedGame.economy;
    gameState.disasters = savedGame.disasters;

    // Initialize map
    gameMap.init(selectCity);

    // Restore cities
    gameState.cities.forEach(city => {
        gameMap.updateCity(city);
    });

    // Restore selected city
    if (savedGame.selectedCityId) {
        const selectedCity = gameMap.getCityById(savedGame.selectedCityId);
        if (selectedCity) {
            // Select city
            const cityElement = document.getElementById(selectedCity.id);
            if (cityElement) {
                cityElement.click();
            }
        }
    }

    // Restore citizen needs
    citizens.init();
    savedGame.needs.forEach(need => {
        citizens.getNeeds().push(need);
    });

    // Restore ideas
    savedGame.ideas.forEach(idea => {
        citizens.getIdeas().push(idea);
    });

    // Restore events
    events.init();
    savedGame.activeEvents.forEach(event => {
        events.getActiveEvents().push(event);
    });
    savedGame.eventHistory.forEach(event => {
        events.getEventHistory().push(event);
    });

    // Update UI
    resources.updateDisplay(gameState.resources);
    updateCityInfo(gameState.selectedCity);
    renderBuildings(gameState.selectedCity);
    updateTabContent(document.querySelector('.tab.active').getAttribute('data-tab'));

    // Update event count display
    const eventCount = events.activeEvents.length;
    const eventCountElement = document.querySelector('.event-count');
    if (eventCount > 0) {
        eventCountElement.textContent = eventCount;
        eventCountElement.style.display = 'block';
    } else {
        eventCountElement.style.display = 'none';
    }
    utils.log(`Oyun yüklendi. Kaydedilme tarihi: ${new Date(savedGame.savedDate).toLocaleString()}`);
}

/**
 * Reset game
 */
function resetGame() {
    if (!confirm('Oyunu sıfırlamak istediğinize emin misiniz? Tüm ilerlemeniz kaybolacak.')) {
        return;
    }

    // Show start screen
    document.getElementById('start-screen').style.display = 'flex';

    // Reset game state
    gameState = {
        difficulty: 'medium',
        turn: 1,
        resources: {},
        cities: [],
        selectedCity: null,
        needsGenerated: false,
        eventChecked: false,
        gameStarted: false,
        tutorialCompleted: gameState.tutorialCompleted,
        resourcesCollectedThisTurn: false,
        happinessReductionPerCollection: 8,
        loginRequired: true,
        army: {
            infantry: 0,
            cavalry: 0,
            artillery: 0,
            morale: 100,
            experience: 0
        },
        diplomacy: {
            relations: {},
            treaties: [],
            activeWars: []
        },
        economy: {
            inflation: 0,
            trade: {
                imports: [],
                exports: [],
                balance: 0
            },
            marketPrices: {}
        },
        disasters: {
            active: [],
            risk: 0
        }
    };

    // Clear UI
    document.getElementById('buildings-container').innerHTML = '';
    document.getElementById('city-info').innerHTML = '';
    document.getElementById('selected-city-title').textContent = 'Şehir seçilmedi';
    document.getElementById('game-log').innerHTML = '<p>Oyun sıfırlandı. Yeni oyun başlatın.</p>';

    // Reset resources display
    utils.updateResource('money', 0);
    utils.updateResource('materials', 0);
    utils.updateResource('workers', 0);

    // Remove city highlights
    document.querySelectorAll('.city').forEach(city => {
        city.classList.remove('active');
    });
}

/**
 * Show tutorial
 */
function showTutorial() {
    tutorialNavigation.startTutorial();
}

// Add a "Next Turn" button to the UI
document.addEventListener('DOMContentLoaded', function() {
        // Create next turn button
    const nextTurnButton = document.createElement('button');
    nextTurnButton.id = 'next-turn-btn';
    nextTurnButton.innerHTML = '<i class="fas fa-forward"></i> Sonraki Tur';
    nextTurnButton.addEventListener('click', nextTurn);

    // Add button to footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.appendChild(document.createElement('br'));
        footer.appendChild(nextTurnButton);
    }
});