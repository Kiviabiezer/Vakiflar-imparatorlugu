/**
 * Citizens needs management for the Ottoman Empire game
 */

const citizens = {
    /**
     * Initialize citizens module
     */
    init: function() {
        this.needs = [];
        this.ideas = [];
        
        // Rastgele başlangıç fikirleri oluştur
        this.generateRandomIdeas(3);
    },
    
    /**
     * Önceden hazırlanmış fikir listesi
     */
    predefinedIdeas: [
        "İmparatorluk genelinde su kanalları ve çeşmeler inşa etmeliyiz, halk temiz suya erişim sağlamalı.",
        "Her mahallede ücretsiz aşevi açılmalı, fakirlere yemek dağıtılmalı.",
        "Medreseler artırılmalı, eğitim yaygınlaştırılmalı.",
        "Yeni vakıf kütüphaneleri kurulmalı, ilim yayılmalı.",
        "Kervan yolları üzerinde daha fazla kervansaray yapılmalı.",
        "Bozuk yollar tamir edilmeli, ticaret kolaylaştırılmalı.",
        "Çocuklar için daha fazla mektep açılmalı, geleceğimiz için şart.",
        "Esnaf loncaları desteklenmeli, zanaatkarlar teşvik edilmeli.",
        "Şehir surları güçlendirilmeli, güvenlik artırılmalı.",
        "Çarşı ve pazarlar genişletilmeli, ticaret canlandırılmalı.",
        "Darüşşifalar inşa edilmeli, tıp eğitimi ve sağlık hizmetleri yaygınlaştırılmalı.",
        "Çiftçilere alet ve tohum yardımı yapılmalı, tarım desteklenmeli.",
        "Köprüler inşa edilmeli, nehirler aşılabilir olmalı.",
        "Bayındırlık projeleri hızlandırılmalı, şehirlerimiz daha yaşanılır olmalı.",
        "İmarethaneler genişletilmeli, yolcular misafir edilmeli.",
        "İpek Yolu ticareti canlandırılmalı, gümrük kolaylıkları sağlanmalı.",
        "Esnaflar için yeni bedesten inşa edilmeli.",
        "Yeni cami ve mescitler inşa edilmeli, ibadet yerleri artırılmalı.",
        "Sanat ve zanaat eğitimi için okullar açılmalı.",
        "Dini bayramlarda fakirlere daha çok yardım yapılmalı.",
        "Şehir içi güvenlik artırılmalı, asayişi sağlayacak kolluk kuvvetleri çoğaltılmalı.",
        "Vakıf çalışanları için daha iyi şartlar sağlanmalı.",
        "Şehir içi yeşil alanlar artırılmalı, bahçeler düzenlenmeli.",
        "Hamamlar ve temizlik yerleri çoğaltılmalı, halk sağlığı korunmalı.",
        "İmparatorluk ordusuna daha fazla destek verilmeli.",
        "Mahkemeler adil olmalı, kadılar denetlenmeli.",
        "Taşra ile başkent arasındaki iletişim güçlendirilmeli.",
        "Köylülerden alınan vergiler azaltılmalı, üretim teşvik edilmeli.",
        "Sel felaketlerine karşı önlem alınmalı, setler inşa edilmeli.",
        "Kuraklık tehlikesine karşı su depoları yapılmalı.",
        "İmparatorluk içinde farklı inançlara saygı gösterilmeli.",
        "Baharat Yolu üzerindeki ticaret güvenliği artırılmalı.",
        "Gemi yapımı teşvik edilmeli, deniz ticareti geliştirilmeli.",
        "İlim adamları daha fazla desteklenmeli, kitap yazımı teşvik edilmeli.",
        "Dini eğitim veren kurumlar denetlenmeli, kalite artırılmalı.",
        "Dullar ve yetimler için vakıf evleri inşa edilmeli.",
        "Meyve ağaçları dikilmeli, bahçecilik teşvik edilmeli.",
        "İçme suyu kaynakları korunmalı, kirlilik önlenmeli.",
        "Yabancı elçilere daha iyi konaklama imkanları sunulmalı.",
        "Esnaf ve zanaatkarların ürettiği mallar kalite kontrolünden geçirilmeli."
    ],
    
    /**
     * Belirli sayıda rastgele fikir oluştur
     * @param {number} count - Oluşturulacak fikir sayısı
     */
    generateRandomIdeas: function(count) {
        for (let i = 0; i < count; i++) {
            // Fikir listesinden rastgele bir fikir seç
            const randomIndex = utils.randomInt(0, this.predefinedIdeas.length - 1);
            const ideaText = this.predefinedIdeas[randomIndex];
            
            // Anonim vatandaş isimleri
            const citizenNames = [
                "İstanbullu Tüccar", "Bursalı Zanaatkar", "Edirneli Çiftçi", 
                "Konyalı Alim", "İzmirli Esnaf", "Trabzonlu Balıkçı",
                "Şamlı Tacir", "Bağdatlı Sanatkar", "Selanikli Zeytin Üreticisi",
                "Kahireli Baharat Tüccarı", "Saraybosna'dan Bir Vakıf Görevlisi",
                "Sofya'dan Bir Kadı", "Konya'dan Bir Mevlevi Derviş",
                "Üsküdar'dan Bir İmam", "Beyoğlu'ndan Bir Meyhaneci"
            ];
            
            const randomCitizen = citizenNames[utils.randomInt(0, citizenNames.length - 1)];
            
            // Yeni fikir oluştur
            const idea = {
                id: 'idea_' + Date.now() + '_' + i,
                text: ideaText,
                from: randomCitizen,
                likes: utils.randomInt(0, 5),
                dislikes: utils.randomInt(0, 2),
                timeCreated: Date.now() - utils.randomInt(1000, 1000000)  // Biraz önce oluşturulmuş gibi
            };
            
            this.ideas.push(idea);
        }
    },
    
    /**
     * Generate random needs for citizens
     * @param {Array} cities - Array of city objects
     * @param {string} difficulty - Game difficulty
     * @returns {Array} - Array of need objects
     */
    generateNeeds: function(cities, difficulty) {
        // Clear current needs
        this.needs = [];
        
        // Number of needs to generate
        let needsCount;
        switch (difficulty) {
            case 'easy':
                needsCount = utils.randomInt(2, 4);
                break;
            case 'medium':
                needsCount = utils.randomInt(3, 6);
                break;
            case 'hard':
                needsCount = utils.randomInt(5, 8);
                break;
            default:
                needsCount = utils.randomInt(3, 5);
        }
        
        // Generate needs
        for (let i = 0; i < needsCount; i++) {
            const need = this.generateRandomNeed(cities, difficulty);
            this.needs.push(need);
        }
        
        return this.needs;
    },
    
    /**
     * Generate a random need
     * @param {Array} cities - Array of city objects
     * @param {string} difficulty - Game difficulty
     * @returns {Object} - Need object
     */
    generateRandomNeed: function(cities, difficulty) {
        // Available need types
        const needTypes = [
            {
                type: 'water',
                title: 'Temiz Su İhtiyacı',
                descriptions: [
                    'Şehirdeki çeşmeler yetersiz, halk su sıkıntısı çekiyor.',
                    'Kuraklık nedeniyle su kaynakları azaldı, yeni çeşmeler gerekli.',
                    'Mevcut su kanalları eskidi, onarım ve yeni su yapıları lazım.'
                ],
                priority: ['high', 'medium', 'high'],
                baseCost: { money: 200, materials: 150, workers: 10 },
                baseReward: { happiness: 10, prestige: 3 }
            },
            {
                type: 'health',
                title: 'Sağlık Hizmetleri',
                descriptions: [
                    'Yaygın hastalıklar için yeni darüşşifalar gerekli.',
                    'Hekim sayısı yetersiz, yeni tıp medreselerine ihtiyaç var.',
                    'Salgın hastalıklarla mücadele için sağlık önlemleri alınmalı.'
                ],
                priority: ['high', 'medium', 'high'],
                baseCost: { money: 400, materials: 250, workers: 20 },
                baseReward: { happiness: 15, prestige: 5 }
            },
            {
                type: 'education',
                title: 'Eğitim İmkanları',
                descriptions: [
                    'Çocuklar için yeni mektepler açılması isteniyor.',
                    'İlim tahsili için medrese ihtiyacı artıyor.',
                    'İmparatorluğun geleceği için eğitimli insanlara ihtiyaç var.'
                ],
                priority: ['medium', 'high', 'medium'],
                baseCost: { money: 350, materials: 200, workers: 15 },
                baseReward: { happiness: 10, prestige: 8 }
            },
            {
                type: 'security',
                title: 'Güvenlik Sorunu',
                descriptions: [
                    'Eşkıyalar yolları tehdit ediyor, güvenlik güçleri gerekli.',
                    'Şehirde hırsızlık olayları arttı, daha fazla nizam gerekiyor.',
                    'Sınır güvenliği için asker ve kale takviyesi şart.'
                ],
                priority: ['high', 'medium', 'high'],
                baseCost: { money: 500, materials: 300, workers: 25 },
                baseReward: { happiness: 12, prestige: 10 }
            },
            {
                type: 'food',
                title: 'Yiyecek Sıkıntısı',
                descriptions: [
                    'Kıtlık tehlikesi var, gıda stoklarının artırılması gerekli.',
                    'Fakirler için aşevleri açılmalı.',
                    'Çiftçilere destek verilmeli, tarım alanları genişletilmeli.'
                ],
                priority: ['high', 'medium', 'high'],
                baseCost: { money: 300, materials: 150, workers: 20 },
                baseReward: { happiness: 20, prestige: 5 }
            },
            {
                type: 'infrastructure',
                title: 'Altyapı Sorunları',
                descriptions: [
                    'Yollar bozuk, ticaret zorlaşıyor. Onarım gerekli.',
                    'Köprüler yıpranmış, tamir edilmeli.',
                    'Şehir çarşıları genişletilmeli, yeni bedesten lazım.'
                ],
                priority: ['medium', 'low', 'medium'],
                baseCost: { money: 450, materials: 350, workers: 30 },
                baseReward: { happiness: 8, prestige: 7 }
            },
            {
                type: 'religion',
                title: 'Dini İhtiyaçlar',
                descriptions: [
                    'Yeni bir cami inşa edilmesi talep ediliyor.',
                    'Ramazan ayı için özel hazırlıklar yapılmalı.',
                    'Dini bayramlar için şehirde kutlama düzenlenmeli.'
                ],
                priority: ['medium', 'low', 'medium'],
                baseCost: { money: 600, materials: 400, workers: 35 },
                baseReward: { happiness: 15, prestige: 12 }
            },
            {
                type: 'entertainment',
                title: 'Sosyal Etkinlikler',
                descriptions: [
                    'Halk eğlence istiyor, şenlikler düzenlenmeli.',
                    'Sanat ve müzik gösterileri için destek verilmeli.',
                    'Kahvehaneler ve sosyal alanlar artırılmalı.'
                ],
                priority: ['low', 'low', 'medium'],
                baseCost: { money: 250, materials: 100, workers: 15 },
                baseReward: { happiness: 25, prestige: 3 }
            }
        ];
        
        // Select random need type
        const needType = needTypes[utils.randomInt(0, needTypes.length - 1)];
        
        // Select random city
        const city = cities[utils.randomInt(0, cities.length - 1)];
        
        // Select random description index
        const descIndex = utils.randomInt(0, needType.descriptions.length - 1);
        
        // Determine priority
        const priority = needType.priority[descIndex];
        
        // Adjust cost based on difficulty
        const costMultiplier = difficulty === 'easy' ? 0.8 : (difficulty === 'hard' ? 1.3 : 1);
        const cost = {
            money: Math.round(needType.baseCost.money * costMultiplier),
            materials: Math.round(needType.baseCost.materials * costMultiplier),
            workers: Math.round(needType.baseCost.workers * costMultiplier)
        };
        
        // Adjust reward based on priority and difficulty
        const priorityMultiplier = priority === 'high' ? 1.2 : (priority === 'low' ? 0.8 : 1);
        const rewardMultiplier = difficulty === 'easy' ? 1.2 : (difficulty === 'hard' ? 0.8 : 1);
        const rewards = {
            happiness: Math.round(needType.baseReward.happiness * priorityMultiplier * rewardMultiplier),
            prestige: Math.round(needType.baseReward.prestige * priorityMultiplier * rewardMultiplier)
        };
        
        // Money reward for some needs
        if (utils.randomInt(1, 3) === 1) {
            rewards.money = Math.round(cost.money * 1.5);
        }
        
        // Generate unique ID
        const id = needType.type + '_' + Date.now() + '_' + utils.randomInt(1000, 9999);
        
        return {
            id: id,
            type: needType.type,
            title: needType.title,
            description: needType.descriptions[descIndex],
            city: city.name,
            priority: priority,
            cost: cost,
            rewards: rewards,
            timeCreated: Date.now()
        };
    },
    
    /**
     * Add a new idea to the list
     * @param {string} text - Idea text
     * @returns {Object} - New idea object
     */
    addIdea: function(text) {
        const idea = {
            id: 'idea_' + Date.now(),
            text: text,
            from: 'Anonim Vatandaş',
            likes: 0,
            dislikes: 0,
            timeCreated: Date.now()
        };
        
        this.ideas.push(idea);
        
        return idea;
    },
    
    /**
     * Vote on an idea
     * @param {string} ideaId - Idea ID
     * @param {boolean} isLike - True for like, false for dislike
     * @returns {Object|null} - Updated idea or null if not found
     */
    voteIdea: function(ideaId, isLike) {
        const ideaIndex = this.ideas.findIndex(idea => idea.id === ideaId);
        if (ideaIndex === -1) return null;
        
        if (isLike) {
            this.ideas[ideaIndex].likes++;
        } else {
            this.ideas[ideaIndex].dislikes++;
        }
        
        return this.ideas[ideaIndex];
    },
    
    /**
     * Remove a need
     * @param {string} needId - Need ID
     * @returns {boolean} - True if successfully removed
     */
    removeNeed: function(needId) {
        const index = this.needs.findIndex(need => need.id === needId);
        if (index !== -1) {
            this.needs.splice(index, 1);
            return true;
        }
        return false;
    },
    
    /**
     * Get all current needs
     * @returns {Array} - Array of need objects
     */
    getNeeds: function() {
        return this.needs;
    },
    
    /**
     * Get all ideas
     * @returns {Array} - Array of idea objects
     */
    getIdeas: function() {
        return this.ideas;
    },
    
    /**
     * Render needs to container
     * @param {HTMLElement} container - Container element
     * @param {Object} gameResources - Player resources
     * @param {Function} onFulfill - Callback when fulfill button is clicked
     */
    renderNeeds: function(container, gameResources, onFulfill) {
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Sort needs by priority
        const sortedNeeds = [...this.needs].sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        if (sortedNeeds.length === 0) {
            container.innerHTML = '<p>Şu anda halkın özel bir ihtiyacı yok. Tebrikler!</p>';
            return;
        }
        
        // Render needs
        sortedNeeds.forEach(need => {
            const needElement = document.createElement('div');
            needElement.className = `need-item ${need.priority}-priority`;
            
            const canAfford = utils.canAfford(need.cost, gameResources);
            
            let rewardsHtml = '';
            if (need.rewards.happiness) {
                rewardsHtml += `<div>Halk Mutluluğu: +${need.rewards.happiness}</div>`;
            }
            if (need.rewards.prestige) {
                rewardsHtml += `<div>İtibar: +${need.rewards.prestige}</div>`;
            }
            if (need.rewards.money) {
                rewardsHtml += `<div>Akçe: +${utils.formatNumber(need.rewards.money)}</div>`;
            }
            
            needElement.innerHTML = `
                <div class="need-details">
                    <div class="need-title">
                        ${need.title}
                        <span class="priority-tag">${need.priority === 'high' ? 'Acil' : (need.priority === 'medium' ? 'Önemli' : 'Normal')}</span>
                    </div>
                    <div class="need-description">
                        <p><strong>Şehir:</strong> ${need.city}</p>
                        <p>${need.description}</p>
                    </div>
                    <div class="need-cost">
                        <strong>Maliyet:</strong> 
                        <span>${utils.formatNumber(need.cost.money)} Akçe</span> | 
                        <span>${utils.formatNumber(need.cost.materials)} Malzeme</span> | 
                        <span>${utils.formatNumber(need.cost.workers)} İşçi</span>
                    </div>
                </div>
                <div class="need-reward">
                    <div>Ödüller:</div>
                    ${rewardsHtml}
                </div>
            `;
            
            // Add fulfill button
            const needActions = document.createElement('div');
            needActions.className = 'need-actions';
            
            const fulfillBtn = document.createElement('button');
            fulfillBtn.innerHTML = '<i class="fas fa-check"></i> Yerine Getir';
            fulfillBtn.disabled = !canAfford;
            
            if (!canAfford) {
                fulfillBtn.title = 'Yeterli kaynağınız yok';
            }
            
            fulfillBtn.onclick = () => onFulfill(need);
            
            needActions.appendChild(fulfillBtn);
            needElement.appendChild(needActions);
            
            container.appendChild(needElement);
        });
    },
    
    /**
     * Render ideas to container
     * @param {HTMLElement} container - Container element
     * @param {Function} onVote - Callback when vote button is clicked
     */
    renderIdeas: function(container, onVote) {
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Sort ideas by creation time (newest first)
        const sortedIdeas = [...this.ideas].sort((a, b) => b.timeCreated - a.timeCreated);
        
        if (sortedIdeas.length === 0) {
            container.innerHTML = '<p>Henüz halktan gelen bir fikir yok.</p>';
            return;
        }
        
        // Render ideas
        sortedIdeas.forEach(idea => {
            const ideaElement = document.createElement('div');
            ideaElement.className = 'idea-item';
            
            ideaElement.innerHTML = `
                <div class="idea-from">${idea.from}</div>
                <div class="idea-text">"${idea.text}"</div>
                <div class="idea-vote">
                    <button class="vote-btn like-btn" data-idea="${idea.id}" data-vote="like">
                        <i class="fas fa-thumbs-up"></i> ${idea.likes}
                    </button>
                    <button class="vote-btn dislike-btn" data-idea="${idea.id}" data-vote="dislike">
                        <i class="fas fa-thumbs-down"></i> ${idea.dislikes}
                    </button>
                </div>
            `;
            
            // Add event listeners to vote buttons
            const voteButtons = ideaElement.querySelectorAll('.vote-btn');
            voteButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const ideaId = btn.getAttribute('data-idea');
                    const isLike = btn.getAttribute('data-vote') === 'like';
                    onVote(ideaId, isLike);
                });
            });
            
            container.appendChild(ideaElement);
        });
    }
};
