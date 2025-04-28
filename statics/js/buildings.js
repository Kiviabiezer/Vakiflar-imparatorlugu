/**
 * Building management for the Ottoman Empire game
 */

const buildings = {
    /**
     * Initialize buildings module
     */
    init: function() {
        this.types = this.defineBuildingTypes();
    },

    /**
     * Define available building types
     * @returns {Array} - Array of building type objects
     */
    defineBuildingTypes: function() {
        return [
            {
                id: 'barracks',
                name: 'Kışla',
                icon: 'fort-awesome',
                category: 'military',
                description: 'Asker eğitim merkezi. Ordu gücünü ve deneyimini artırır.',
                cost: {
                    money: 800,
                    materials: 600,
                    workers: 40
                },
                maintenance: {
                    money: 100,
                    materials: 30
                },
                benefits: {
                    army_training: 20,
                    morale: 10
                },
                requirements: {
                    population: 20000
                },
                constructionTime: 6
            },
            {
                id: 'embassy',
                name: 'Elçilik',
                icon: 'handshake',
                category: 'diplomacy',
                description: 'Diplomatik ilişkileri geliştirir ve yeni anlaşmalar yapılmasını sağlar.',
                cost: {
                    money: 600,
                    materials: 400,
                    workers: 25
                },
                maintenance: {
                    money: 80,
                    materials: 20
                },
                benefits: {
                    diplomacy: 15,
                    prestige: 10
                },
                requirements: {
                    population: 25000
                },
                constructionTime: 5
            },
            {
                id: 'granary',
                name: 'Tahıl Ambarı',
                icon: 'wheat',
                category: 'economy',
                description: 'Gıda depolama ve dağıtım merkezi. Kıtlık riskini azaltır.',
                cost: {
                    money: 400,
                    materials: 300,
                    workers: 20
                },
                maintenance: {
                    money: 40,
                    materials: 15
                },
                benefits: {
                    food_security: 20,
                    happiness: 5
                },
                requirements: {
                    population: 15000
                },
                constructionTime: 4
            },
            {
                id: 'mosque',
                name: 'Cami',
                icon: 'mosque',
                category: 'religious',
                description: 'Hem ibadet yeri hem de sosyal hizmet merkezi olarak hizmet verir. Halkın moralini artırır.',
                historicalInfo: 'Osmanlı İmparatorluğu\'nda camiler sadece ibadet yerleri değil, aynı zamanda eğitim ve sosyal yardımlaşma merkezleriydi.',
                cost: {
                    money: 700,
                    materials: 450,
                    workers: 25
                },
                maintenance: {
                    money: 70,
                    materials: 15
                },
                benefits: {
                    happiness: 15,
                    cultural: 10,
                    education: 8,
                    religious_harmony: 12,
                    social_stability: 10,
                    local_economy: 5,
                    research: 3,
                    technological_advancement: 2
                },
                requirements: {
                    population: 5000
                },
                constructionTime: 4
            },
            {
                id: 'medrese',
                name: 'Medrese',
                icon: 'school',
                category: 'education',
                description: 'Dini ve bilimsel eğitim veren okul. Kültürel gelişimi artırır.',
                historicalInfo: 'Medreseler Osmanlı\'nın eğitim sisteminin temeliydi. Hem dini hem de müspet bilimlerin eğitimi verilirdi.',
                cost: {
                    money: 550,
                    materials: 350,
                    workers: 20
                },
                maintenance: {
                    money: 55,
                    materials: 10
                },
                benefits: {
                    happiness: 10,
                    cultural: 20
                },
                requirements: {
                    population: 8000,
                    buildings: ['mosque']
                },
                constructionTime: 3
            },
            {
                id: 'caravanserai',
                name: 'Kervansaray',
                icon: 'warehouse',
                category: 'economic',
                description: 'Yolcular ve ticaret kervanları için konaklama yeri. Ticari geliri artırır.',
                historicalInfo: 'Kervansaraylar ticaret yolları üzerinde kurulur, tüccarlar ve yolcular için güvenli konaklama imkanı sunardı.',
                cost: {
                    money: 800,
                    materials: 550,
                    workers: 35
                },
                maintenance: {
                    money: 80,
                    materials: 20
                },
                benefits: {
                    income: 100,
                    happiness: 5
                },
                requirements: {
                    population: 10000
                },
                constructionTime: 5
            },
            {
                id: 'hammam',
                name: 'Hamam',
                icon: 'hot-tub',
                category: 'social',
                description: 'Halk hamamı. Sağlık ve sosyal etkileşimi artırır.',
                historicalInfo: 'Hamamlar Osmanlı şehir hayatının önemli bir parçasıydı ve temizliğin yanında sosyal bir toplanma yeri olarak hizmet ederdi.',
                cost: {
                    money: 300,
                    materials: 200,
                    workers: 15
                },
                maintenance: {
                    money: 30,
                    materials: 10
                },
                benefits: {
                    happiness: 12,
                    health: 15
                },
                requirements: {
                    population: 7000
                },
                constructionTime: 3
            },
            {
                id: 'market',
                name: 'Bedesten',
                icon: 'store',
                category: 'economic',
                description: 'Kapalı çarşı. Ticari aktiviteyi ve geliri artırır.',
                historicalInfo: 'Bedestenler, Osmanlı çarşılarının merkezi olup değerli malların ticaretinin yapıldığı yerlerdi.',
                cost: {
                    money: 400,
                    materials: 250,
                    workers: 20
                },
                maintenance: {
                    money: 40,
                    materials: 10
                },
                benefits: {
                    income: 80,
                    happiness: 8
                },
                requirements: {
                    population: 15000
                },
                constructionTime: 4
            },
            {
                id: 'fountain',
                name: 'Çeşme',
                icon: 'tint',
                category: 'infrastructure',
                description: 'Su çeşmesi. Temel su ihtiyacını karşılar.',
                historicalInfo: 'Osmanlı döneminde su çeşmeleri sadece pratik amaçlı değil, aynı zamanda hayır işi olarak da yapılırdı.',
                cost: {
                    money: 150,
                    materials: 100,
                    workers: 10
                },
                maintenance: {
                    money: 15,
                    materials: 5
                },
                benefits: {
                    happiness: 5,
                    health: 10
                },
                requirements: {
                    population: 3000
                },
                constructionTime: 2
            },
            {
                id: 'hospital',
                name: 'Darüşşifa',
                icon: 'hospital',
                category: 'healthcare',
                description: 'Hastane. Halkın sağlığını iyileştirir.',
                historicalInfo: 'Osmanlı hastaneleri (darüşşifa) döneminin en ileri tıbbi bakımını sağlardı ve genellikle külliye kompleksleri içinde yer alırdı.',
                cost: {
                    money: 700,
                    materials: 450,
                    workers: 30
                },
                maintenance: {
                    money: 70,
                    materials: 20
                },
                benefits: {
                    happiness: 10,
                    health: 25
                },
                requirements: {
                    population: 20000,
                    buildings: ['medrese']
                },
                constructionTime: 6
            },
            {
                id: 'imaret',
                name: 'İmaret',
                icon: 'utensils',
                category: 'social',
                description: 'Yoksullara yemek dağıtan aşevi. Toplumsal refahı artırır.',
                historicalInfo: 'İmaretler, Osmanlı sosyal yardım sisteminin temel kurumlarından biriydi ve ihtiyaç sahiplerine ücretsiz yemek dağıtırdı.',
                cost: {
                    money: 350,
                    materials: 200,
                    workers: 15
                },
                maintenance: {
                    money: 60,
                    materials: 30
                },
                benefits: {
                    happiness: 20,
                    social: 15
                },
                requirements: {
                    population: 12000,
                    buildings: ['mosque']
                },
                constructionTime: 3
            },
            {
                id: 'library',
                name: 'Kütüphane',
                icon: 'book',
                category: 'education',
                description: 'Kitapların toplandığı ve korunduğu kütüphane. Eğitim ve kültürel gelişimi destekler.',
                historicalInfo: 'Osmanlı kütüphaneleri, nadir el yazmaları da dahil olmak üzere önemli bilgi hazinelerini korurdu.',
                cost: {
                    money: 450,
                    materials: 300,
                    workers: 15
                },
                maintenance: {
                    money: 30,
                    materials: 10
                },
                benefits: {
                    cultural: 25,
                    happiness: 5
                },
                requirements: {
                    population: 15000,
                    buildings: ['medrese']
                },
                constructionTime: 4
            },
            {
                id: 'fortress',
                name: 'Kale',
                icon: 'shield-alt',
                category: 'military',
                description: 'Savunma yapısı. Şehrin güvenliğini artırır.',
                historicalInfo: 'Osmanlı kaleleri stratejik noktalarda inşa edilir ve imparatorluğun sınırlarını korurdu.',
                cost: {
                    money: 800,
                    materials: 600,
                    workers: 40
                },
                maintenance: {
                    money: 80,
                    materials: 20
                },
                benefits: {
                    defense: 30,
                    prestige: 10
                },
                requirements: {
                    population: 25000
                },
                constructionTime: 8
            },
            {
                id: 'waqf_complex',
                name: 'Külliye',
                icon: 'landmark',
                category: 'waqf',
                description: 'Cami, medrese, imaret ve darüşşifayı içeren büyük vakıf kompleksi.',
                historicalInfo: 'Külliyeler, Osmanlı şehirlerinin merkezinde yer alan ve toplumun tüm ihtiyaçlarını karşılayan vakıf kompleksleriydi.',
                cost: {
                    money: 2000,
                    materials: 1500,
                    workers: 100
                },
                maintenance: {
                    money: 200,
                    materials: 50
                },
                benefits: {
                    happiness: 30,
                    cultural: 25,
                    prestige: 20,
                    income: 250,
                    health: 15,
                    education: 20
                },
                requirements: {
                    population: 50000,
                    buildings: ['mosque', 'medrese']
                },
                constructionTime: 12
            }
        ];
    },

    /**
     * Get all building types
     * @returns {Array} - Array of building types
     */
    getAllBuildingTypes: function() {
        return this.types;
    },

    /**
     * Get building type by ID
     * @param {string} id - Building type ID
     * @returns {Object|null} - Building type object or null
     */
    getBuildingTypeById: function(id) {
        return this.types.find(type => type.id === id) || null;
    },

    /**
     * Check if a building can be built in a city
     * @param {string} buildingTypeId - Building type ID
     * @param {Object} city - City object
     * @param {Object} resources - Player resources
     * @returns {Object} - Result with canBuild and reason properties
     */
    canBuildInCity: function(buildingTypeId, city, resources) {
        const buildingType = this.getBuildingTypeById(buildingTypeId);
        if (!buildingType) {
            return { canBuild: false, reason: 'Geçersiz yapı türü' };
        }

        // Check if city has enough population
        if (city.population < buildingType.requirements.population) {
            return {
                canBuild: false,
                reason: `Bu yapı için en az ${utils.formatNumber(buildingType.requirements.population)} nüfus gerekli`
            };
        }

        // Check if required buildings exist
        if (buildingType.requirements.buildings) {
            for (const requiredBuildingId of buildingType.requirements.buildings) {
                const hasBuilding = city.buildings.some(building =>
                    building.typeId === requiredBuildingId && building.status === 'completed');

                if (!hasBuilding) {
                    const requiredBuilding = this.getBuildingTypeById(requiredBuildingId);
                    return {
                        canBuild: false,
                        reason: `Önce ${requiredBuilding.name} inşa etmelisiniz`
                    };
                }
            }
        }

        // Check if player has enough resources
        if (!utils.canAfford(buildingType.cost, resources)) {
            return { canBuild: false, reason: 'Yeterli kaynağınız yok' };
        }

        // Check if building already exists in the city
        const exists = city.buildings.some(building =>
            building.typeId === buildingTypeId &&
            (building.status === 'completed' || building.status === 'construction'));

        if (exists) {
            return { canBuild: false, reason: 'Bu yapı zaten mevcut veya inşa ediliyor' };
        }

        return { canBuild: true, reason: '' };
    },

    /**
     * Start building construction in a city
     * @param {string} buildingTypeId - Building type ID
     * @param {Object} city - City object
     * @param {Object} resources - Player resources
     * @returns {Object} - Updated city object
     */
    startConstruction: function(buildingTypeId, city, resources) {
        const buildingType = this.getBuildingTypeById(buildingTypeId);
        if (!buildingType) return city;

        // Check if can build
        const buildCheck = this.canBuildInCity(buildingTypeId, city, resources);
        if (!buildCheck.canBuild) return city;

        // Pay costs
        utils.payCosts(buildingType.cost, resources);

        // Add building to city
        const newBuilding = {
            id: buildingTypeId + '_' + Date.now(),
            typeId: buildingTypeId,
            name: buildingType.name,
            status: 'construction',
            constructionProgress: 0,
            constructionTotal: buildingType.constructionTime,
            condition: 100
        };

        city.buildings.push(newBuilding);

        utils.log(`<strong>${city.name}</strong> şehrinde <strong>${buildingType.name}</strong> inşaatına başlandı.`);

        return city;
    },

    /**
     * Update construction progress
     * @param {Object} city - City object
     * @returns {Object} - Updated city object
     */
    updateConstruction: function(city) {
        city.buildings.forEach(building => {
            if (building.status === 'construction') {
                building.constructionProgress += 1;

                // Check if construction is complete
                if (building.constructionProgress >= building.constructionTotal) {
                    building.status = 'completed';
                    const buildingType = this.getBuildingTypeById(building.typeId);
                    utils.log(`<strong>${city.name}</strong> şehrinde <strong>${buildingType.name}</strong> inşaatı tamamlandı.`);
                }
            }
        });

        return city;
    },

    /**
     * Update building maintenance and condition
     * @param {Object} city - City object
     * @param {Object} resources - Player resources
     * @returns {Object} - Updated city object
     */
    updateBuildingMaintenance: function(city, resources) {
        city.buildings.forEach(building => {
            if (building.status === 'completed') {
                const buildingType = this.getBuildingTypeById(building.typeId);
                if (!buildingType) return;

                // Decrease condition if not enough maintenance resources
                if (resources.money < buildingType.maintenance.money ||
                    resources.materials < buildingType.maintenance.materials) {

                    // Reduce condition by 5-10 points
                    building.condition = Math.max(0, building.condition - utils.randomInt(5, 10));

                    // If condition is critical, mark as needs repair
                    if (building.condition < 30 && building.status !== 'needs_repair') {
                        building.status = 'needs_repair';
                        utils.log(`<span style="color: #d32f2f">⚠</span> <strong>${city.name}</strong> şehrindeki <strong>${building.name}</strong> onarıma ihtiyaç duyuyor.`);
                    }
                } else {
                    // Pay maintenance costs
                    resources.money -= buildingType.maintenance.money;
                    resources.materials -= buildingType.maintenance.materials;

                    // Update UI
                    utils.updateResource('money', resources.money);
                    utils.updateResource('materials', resources.materials);

                    // Slight condition improvement for well-maintained buildings
                    if (building.condition < 100) {
                        building.condition = Math.min(100, building.condition + 1);
                    }
                }
            }
        });

        return city;
    },

    /**
     * Repair a building
     * @param {string} buildingId - Building ID
     * @param {Object} city - City object
     * @param {Object} resources - Player resources
     * @returns {Object} - Updated city object
     */
    repairBuilding: function(buildingId, city, resources) {
        const buildingIndex = city.buildings.findIndex(b => b.id === buildingId);
        if (buildingIndex === -1) return city;

        const building = city.buildings[buildingIndex];
        if (building.status !== 'needs_repair') return city;

        const buildingType = this.getBuildingTypeById(building.typeId);
        if (!buildingType) return city;

        // Calculate repair costs based on damage
        const damagePercent = 100 - building.condition;
        const repairCosts = {
            money: Math.ceil(buildingType.cost.money * damagePercent * 0.01 * 0.5),
            materials: Math.ceil(buildingType.cost.materials * damagePercent * 0.01 * 0.5),
            workers: Math.ceil(buildingType.cost.workers * damagePercent * 0.01 * 0.3)
        };

        // Check if player can afford repair
        if (!utils.canAfford(repairCosts, resources)) {
            return city;
        }

        // Pay costs
        utils.payCosts(repairCosts, resources);

        // Repair building
        building.condition = 100;
        building.status = 'completed';

        // Update city
        city.buildings[buildingIndex] = building;

        utils.log(`<strong>${city.name}</strong> şehrindeki <strong>${building.name}</strong> onarıldı.`);

        return city;
    },

    /**
     * Render building list for a city
     * @param {Object} city - City object
     * @param {HTMLElement} container - Container element
     * @param {Function} onRepair - Callback when repair button is clicked
     */
    renderBuildingList: function(city, container, onRepair) {
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        if (city.buildings.length === 0) {
            container.innerHTML = '<p>Bu şehirde henüz yapı bulunmuyor.</p>';
            return;
        }

        // Create building list
        city.buildings.forEach(building => {
            const buildingType = this.getBuildingTypeById(building.typeId);
            if (!buildingType) return;

            const buildingElement = document.createElement('div');
            buildingElement.className = 'building';

            let statusText = '';
            let conditionClass = '';

            if (building.status === 'construction') {
                const progress = Math.floor((building.constructionProgress / building.constructionTotal) * 100);
                statusText = `İnşa ediliyor: %${progress}`;
            } else if (building.status === 'needs_repair') {
                statusText = 'Onarım Gerekli';
                conditionClass = 'poor';
            } else {
                if (building.condition > 70) {
                    statusText = 'İyi Durumda';
                    conditionClass = 'good';
                } else if (building.condition > 30) {
                    statusText = 'Orta Durumda';
                    conditionClass = 'fair';
                } else {
                    statusText = 'Kötü Durumda';
                    conditionClass = 'poor';
                }
            }

            buildingElement.innerHTML = `
                <div class="building-image"><i class="fas fa-${buildingType.icon}"></i></div>
                <div>
                    <div class="building-name">${building.name}</div>
                    <div class="building-status ${conditionClass}">${statusText}</div>
                </div>
            `;

            // Add repair button if needed
            if (building.status === 'needs_repair') {
                const repairBtn = document.createElement('button');
                repairBtn.className = 'repair-btn';
                repairBtn.innerHTML = '<i class="fas fa-tools"></i> Onar';
                repairBtn.onclick = () => onRepair(building);

                buildingElement.appendChild(repairBtn);
            }

            container.appendChild(buildingElement);
        });
    },

    /**
     * Render building options for construction
     * @param {Object} city - City object
     * @param {Object} resources - Player resources
     * @param {HTMLElement} container - Container element
     * @param {Function} onSelect - Callback when a building is selected
     */
    renderBuildingOptions: function(city, resources, container, onSelect) {
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Create building options
        this.types.forEach(buildingType => {
            const buildCheck = this.canBuildInCity(buildingType.id, city, resources);

            const optionElement = document.createElement('div');
            optionElement.className = 'building-option';
            if (!buildCheck.canBuild) {
                optionElement.classList.add('disabled');
            }

            optionElement.innerHTML = `
                <div>
                    <div><i class="fas fa-${buildingType.icon}"></i> <strong>${buildingType.name}</strong></div>
                    <div class="building-description">${buildingType.description}</div>
                    <div class="building-cost">
                        <span><i class="fas fa-coins"></i> ${utils.formatNumber(buildingType.cost.money)}</span>
                        <span><i class="fas fa-warehouse"></i> ${utils.formatNumber(buildingType.cost.materials)}</span>
                        <span><i class="fas fa-users"></i> ${utils.formatNumber(buildingType.cost.workers)}</span>
                    </div>
                </div>
            `;

            // Add historical note
            if (buildingType.historicalInfo) {
                const note = utils.createHistoricalNote(buildingType.historicalInfo);
                optionElement.appendChild(note);
            }

            if (!buildCheck.canBuild) {
                const reasonElement = document.createElement('div');
                reasonElement.className = 'building-reason';
                reasonElement.textContent = buildCheck.reason;
                reasonElement.style.color = '#d32f2f';
                optionElement.appendChild(reasonElement);
            } else {
                optionElement.onclick = () => onSelect(buildingType.id);
            }

            container.appendChild(optionElement);
        });
    },

    /**
     * Calculate total benefits from all buildings in a city
     * @param {Object} city - City object
     * @returns {Object} - Total benefits
     */
    calculateCityBenefits: function(city) {
        const benefits = {
            income: 0,
            happiness: 0,
            health: 0,
            cultural: 0,
            defense: 0,
            prestige: 0,
            social: 0,
            army_training: 0,
            diplomacy: 0,
            food_security: 0,
            prosperity: 0,
            production: 0
        };

        city.buildings.forEach(building => {
            if (building.status === 'completed') {
                const buildingType = this.getBuildingTypeById(building.typeId);
                if (!buildingType || !buildingType.benefits) return;

                // Apply benefits based on building condition
                const conditionModifier = building.condition / 100;

                for (const [key, value] of Object.entries(buildingType.benefits)) {
                    if (benefits[key] !== undefined) {
                        benefits[key] += value * conditionModifier;
                    }
                }
            }
        });

        return benefits;
    }
};