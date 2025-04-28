/**
 * Map management for the Ottoman Empire game
 */

const gameMap = {
    /**
     * Initialize the game map
     * @param {Function} onCitySelect - Callback when a city is selected
     */
    init: function(onCitySelect) {
        this.cities = this.createCities();
        this.selectedCity = null;
        this.onCitySelect = onCitySelect;
        this.createCityMarkers();
        
        // Set map background
        const mapElement = document.getElementById('game-map');
        if (mapElement) {
            // Use the PNG map as background
            const mapOverlay = mapElement.querySelector('.map-overlay');
            mapOverlay.style.backgroundImage = 'url(/static/assets/ottoman_map.png)';
            mapOverlay.style.backgroundSize = 'cover';
            mapOverlay.style.backgroundPosition = 'center';
            mapOverlay.style.backgroundRepeat = 'no-repeat';
        }
    },
    
    /**
     * Create city data
     * @returns {Array} - Array of city objects
     */
    createCities: function() {
        return [
            {
                id: 'istanbul',
                name: 'İstanbul',
                position: { top: 85, left: 370 },
                population: 400000,
                isCapital: true,
                description: 'Osmanlı İmparatorluğu\'nun başkenti ve en büyük şehri. 1453\'te fethedildi.',
                buildings: [],
                prosperity: 80,
                defenseLevel: 90,
                cultural: 95,
                resources: {
                    taxRate: 10,
                    production: 15
                }
            },
            {
                id: 'edirne',
                name: 'Edirne',
                position: { top: 65, left: 320 },
                population: 150000,
                isCapital: false,
                description: 'İmparatorluğun eski başkenti. Önemli bir kültür ve ticaret merkezi.',
                buildings: [],
                prosperity: 75,
                defenseLevel: 70,
                cultural: 85,
                resources: {
                    taxRate: 8,
                    production: 10
                }
            },
            {
                id: 'bursa',
                name: 'Bursa',
                position: { top: 135, left: 350 },
                population: 120000,
                isCapital: false,
                description: 'İmparatorluğun ilk başkenti. İpek yolunun önemli bir durağı.',
                buildings: [],
                prosperity: 70,
                defenseLevel: 60,
                cultural: 80,
                resources: {
                    taxRate: 7,
                    production: 12
                }
            },
            {
                id: 'izmir',
                name: 'İzmir',
                position: { top: 210, left: 285 },
                population: 100000,
                isCapital: false,
                description: 'Önemli bir liman şehri. Ticaret ve denizcilik merkezi.',
                buildings: [],
                prosperity: 85,
                defenseLevel: 65,
                cultural: 75,
                resources: {
                    taxRate: 9,
                    production: 13
                }
            },
            {
                id: 'konya',
                name: 'Konya',
                position: { top: 205, left: 403 },
                population: 80000,
                isCapital: false,
                description: 'Anadolu\'nun merkezi. Selçuklu mirası ve kültürel zenginliğiyle ünlü.',
                buildings: [],
                prosperity: 65,
                defenseLevel: 60,
                cultural: 90,
                resources: {
                    taxRate: 6,
                    production: 8
                }
            },
            {
                id: 'trabzon',
                name: 'Trabzon',
                position: { top: 95, left: 510 },
                population: 50000,
                isCapital: false,
                description: 'Karadeniz\'in incisi. Önemli bir ticaret merkezi.',
                buildings: [],
                prosperity: 60,
                defenseLevel: 55,
                cultural: 70,
                resources: {
                    taxRate: 6,
                    production: 7
                }
            },
            {
                id: 'ankara',
                name: 'Ankara',
                position: { top: 145, left: 405 },
                population: 60000,
                isCapital: false,
                description: 'Anadolu\'nun merkezi. Tiftik keçisi ve yünüyle ünlü.',
                buildings: [],
                prosperity: 55,
                defenseLevel: 50,
                cultural: 60,
                resources: {
                    taxRate: 5,
                    production: 6
                }
            },
            {
                id: 'diyarbakir',
                name: 'Diyarbakır',
                position: { top: 195, left: 490 },
                population: 40000,
                isCapital: false,
                description: 'Güneydoğunun kalesi. Tarihi surları ve kültürel zenginliğiyle önemli.',
                buildings: [],
                prosperity: 50,
                defenseLevel: 65,
                cultural: 65,
                resources: {
                    taxRate: 4,
                    production: 5
                }
            },
            {
                id: 'selanik',
                name: 'Selanik',
                position: { top: 120, left: 260 },
                population: 90000,
                isCapital: false,
                description: 'Balkanların incisi. Osmanlı\'nın Avrupa\'ya açılan kapısı.',
                buildings: [],
                prosperity: 75,
                defenseLevel: 60,
                cultural: 80,
                resources: {
                    taxRate: 8,
                    production: 9
                }
            },
            {
                id: 'saraybosna',
                name: 'Saraybosna',
                position: { top: 90, left: 180 },
                population: 35000,
                isCapital: false,
                description: 'Balkanların kalbi. Kültürlerin buluşma noktası.',
                buildings: [],
                prosperity: 60,
                defenseLevel: 55,
                cultural: 75,
                resources: {
                    taxRate: 5,
                    production: 6
                }
            },
            {
                id: 'sofya',
                name: 'Sofya',
                position: { top: 80, left: 240 },
                population: 30000,
                isCapital: false,
                description: 'Balkanların stratejik şehri. Ticaret yollarının kavşağında.',
                buildings: [],
                prosperity: 55,
                defenseLevel: 50,
                cultural: 65,
                resources: {
                    taxRate: 4,
                    production: 5
                }
            },
            {
                id: 'bagdat',
                name: 'Bağdat',
                position: { top: 280, left: 505 },
                population: 110000,
                isCapital: false,
                description: 'Mezopotamya\'nın incisi. Bilim ve kültür merkezi.',
                buildings: [],
                prosperity: 70,
                defenseLevel: 60,
                cultural: 90,
                resources: {
                    taxRate: 7,
                    production: 8
                }
            },
            {
                id: 'kahire',
                name: 'Kahire',
                position: { top: 340, left: 380 },
                population: 300000,
                isCapital: false,
                description: 'Mısır\'ın kalbi. Nil\'in hediyesi ve kültür merkezi.',
                buildings: [],
                prosperity: 85,
                defenseLevel: 75,
                cultural: 95,
                resources: {
                    taxRate: 10,
                    production: 12
                }
            },
            {
                id: 'sivas',
                name: 'Sivas',
                position: { top: 155, left: 460 },
                population: 45000,
                isCapital: false,
                description: 'Anadolu\'nun doğu kapısı. Ticaret yollarının kavşağında.',
                buildings: [],
                prosperity: 50,
                defenseLevel: 55,
                cultural: 60,
                resources: {
                    taxRate: 5,
                    production: 6
                }
            }
        ];
    },
    
    /**
     * Create city markers on the map
     */
    createCityMarkers: function() {
        const mapElement = document.getElementById('game-map');
        if (!mapElement) return;
        
        // Remove existing city markers
        const existingMarkers = mapElement.querySelectorAll('.city');
        existingMarkers.forEach(marker => marker.remove());
        
        // Create city markers
        this.cities.forEach(city => {
            const cityElement = document.createElement('div');
            cityElement.id = city.id;
            cityElement.className = 'city';
            if (city.isCapital) {
                cityElement.classList.add('capital');
            }
            cityElement.textContent = city.name.charAt(0);
            cityElement.style.top = city.position.top + 'px';
            cityElement.style.left = city.position.left + 'px';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'city-tooltip';
            tooltip.innerHTML = `
                <strong>${city.name}</strong>
                <p>${city.isCapital ? '(Başkent)' : ''}</p>
                <p>Nüfus: ${utils.formatNumber(city.population)}</p>
                <p>${city.description}</p>
            `;
            
            // Add event listeners
            cityElement.addEventListener('click', () => this.selectCity(city));
            
            cityElement.addEventListener('mouseenter', (e) => {
                tooltip.style.display = 'block';
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
            });
            
            cityElement.addEventListener('mousemove', (e) => {
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
            });
            
            cityElement.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
            
            mapElement.appendChild(cityElement);
            mapElement.appendChild(tooltip);
        });
    },
    
    /**
     * Handle city selection
     * @param {Object} city - Selected city
     */
    selectCity: function(city) {
        // Remove active class from previous selection
        if (this.selectedCity) {
            const prevCityElement = document.getElementById(this.selectedCity.id);
            if (prevCityElement) {
                prevCityElement.classList.remove('active');
            }
        }
        
        // Set selected city
        this.selectedCity = city;
        
        // Add active class to new selection
        const cityElement = document.getElementById(city.id);
        if (cityElement) {
            cityElement.classList.add('active');
        }
        
        // Update UI with selected city info
        document.getElementById('selected-city-title').textContent = city.name;
        
        // Call callback function
        if (typeof this.onCitySelect === 'function') {
            this.onCitySelect(city);
        }
        
        utils.log(`<strong>${city.name}</strong> şehri seçildi.`);
    },
    
    /**
     * Get the selected city
     * @returns {Object|null} - Selected city or null
     */
    getSelectedCity: function() {
        return this.selectedCity;
    },
    
    /**
     * Update city data
     * @param {Object} city - City to update
     */
    updateCity: function(city) {
        // Find city in array by id
        const index = this.cities.findIndex(c => c.id === city.id);
        if (index !== -1) {
            this.cities[index] = city;
        }
    },
    
    /**
     * Get city by ID
     * @param {string} id - City ID
     * @returns {Object|null} - City object or null
     */
    getCityById: function(id) {
        return this.cities.find(city => city.id === id) || null;
    }
};
