/**
 * Tutorial system for the Ottoman Empire game
 */

const tutorialNavigation = {
    currentStep: 0,
    totalSteps: 0,
    tutorialSteps: [],
    
    /**
     * Initialize tutorial content
     */
    initTutorialContent: function() {
        this.tutorialSteps = [
            {
                title: "Osmanlı Vakıf Sistemine Hoş Geldiniz",
                content: `
                    <div class="tutorial-step">
                        <p>Vakıf İmparatorluğu oyununa hoş geldiniz! Bu oyunda bir Osmanlı vakıf yöneticisi olarak imparatorluğun farklı şehirlerinde halkın ihtiyaçlarını karşılamak için yapılar inşa edecek, kaynakları yönetecek ve tarihi yeniden şekillendireceksiniz.</p>
                        
                        <div class="tutorial-info-box">
                            <h3>Vakıf Nedir?</h3>
                            <p>Vakıf, bir malın veya mülkün toplum yararına ebedi olarak tahsis edilmesidir. Osmanlı'da vakıflar:</p>
                            <ul>
                                <li>Cami, medrese, hastane gibi dini ve sosyal yapıların inşası</li>
                                <li>Fakirlere yemek dağıtımı ve barınma imkanı</li>
                                <li>Eğitim hizmetleri ve burs desteği</li>
                                <li>Su kemerleri ve çeşmeler inşası</li>
                                <li>Yolcu ve tüccarlar için kervansaraylar</li>
                                <li>Şehirlerin imar ve bayındırlık hizmetleri</li>
                            </ul>
                            <p>gibi pek çok alanda hizmet vermiştir.</p>
                        </div>
                        
                        <div class="historical-note">
                            "İnsanların en hayırlısı, insanlara faydalı olandır" düsturu ile hareket eden Osmanlı vakıf sistemi, yüzyıllar boyunca toplumun temel ihtiyaçlarını karşılamıştır.
                        </div>
                        <div class="tutorial-image">
                            <i class="fas fa-mosque fa-3x"></i><br>
                            Osmanlı vakıfları temsili görsel
                        </div>
                        <div class="historical-note">
                            Osmanlı İmparatorluğu'nda vakıflar, toplumun ihtiyaçlarını karşılamak için kurulan hayır kurumlarıydı. Camiler, medreseler, hastaneler, hamamlar, çeşmeler ve daha birçok yapı vakıflar tarafından inşa edilir ve yönetilirdi.
                        </div>
                    </div>
                `
            },
            {
                title: "Harita ve Şehirler",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">1</span> Harita Üzerinde Şehirler</div>
                        <p>Oyun haritasında Osmanlı İmparatorluğu'nun önemli şehirlerini göreceksiniz. Her şehrin kendine özgü özellikleri, nüfusu ve kaynakları vardır.</p>
                        <p>Bir şehri seçmek için şehir simgesine tıklayın. İstanbul başkent olarak kırmızı renkle gösterilir.</p>
                        <div class="tutorial-image">
                            <i class="fas fa-map-marked-alt fa-3x"></i><br>
                            Harita üzerinde şehirler
                        </div>
                        <p>Şehirler hakkında daha fazla bilgi almak için farenizi şehir simgeleri üzerine getirin.</p>
                    </div>
                `
            },
            {
                title: "Kaynakların Yönetimi",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">2</span> Kaynaklar</div>
                        <p>Oyunda üç temel kaynak vardır:</p>
                        <ul>
                            <li><i class="fas fa-coins"></i> <strong>Akçe:</strong> Para birimi, yapıların inşası ve bakımı için gereklidir.</li>
                            <li><i class="fas fa-warehouse"></i> <strong>Malzeme:</strong> İnşaat malzemeleri, yapılar için gereklidir.</li>
                            <li><i class="fas fa-users"></i> <strong>İşçi:</strong> Yapıların inşası ve çeşitli görevler için gerekli insan gücü.</li>
                        </ul>
                        <p>"Topla" düğmesine tıklayarak şehirlerden kaynak toplayabilirsiniz. Her tur otomatik olarak kaynaklar toplanır.</p>
                        <div class="historical-note">
                            Osmanlı ekonomisi tarım, ticaret ve el sanatlarına dayanıyordu. İmparatorluğun para birimi olan akçe, gümüş sikke olarak basılırdı.
                        </div>
                    </div>
                `
            },
            {
                title: "Yapı İnşa Etme",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">3</span> Yapılar</div>
                        <p>Şehirlerde çeşitli yapılar inşa ederek halkın ihtiyaçlarını karşılayabilir ve şehrin gelişimine katkıda bulunabilirsiniz:</p>
                        <ul>
                            <li><i class="fas fa-mosque"></i> <strong>Cami:</strong> Dini ihtiyaçları karşılar ve halkın mutluluğunu artırır.</li>
                            <li><i class="fas fa-school"></i> <strong>Medrese:</strong> Eğitim sağlar ve kültürel gelişimi destekler.</li>
                            <li><i class="fas fa-warehouse"></i> <strong>Kervansaray:</strong> Ticareti geliştirir ve gelir sağlar.</li>
                            <li><i class="fas fa-hospital"></i> <strong>Darüşşifa:</strong> Sağlık hizmetleri sunar.</li>
                            <li>Ve daha fazlası...</li>
                        </ul>
                        <p>Yapı inşa etmek için "İnşa Et" düğmesine tıklayın ve inşa etmek istediğiniz yapıyı seçin. Her yapının farklı maliyetleri ve faydaları vardır.</p>
                    </div>
                `
            },
            {
                title: "Halkın İhtiyaçları",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">4</span> Halkın İhtiyaçları</div>
                        <p>Şehirlerde yaşayan halkın çeşitli ihtiyaçları olacaktır. Bu ihtiyaçları karşılayarak halkın mutluluğunu artırabilir ve çeşitli ödüller kazanabilirsiniz.</p>
                        <p>İhtiyaçlar üç öncelik seviyesine sahiptir:</p>
                        <ul>
                            <li><span style="color: #c62828;">⚠ Acil:</span> Hemen karşılanması gereken yüksek öncelikli ihtiyaçlar.</li>
                            <li><span style="color: #e65100;">⚠ Önemli:</span> Orta öncelikli ihtiyaçlar.</li>
                            <li><span style="color: #33691e;">⚠ Normal:</span> Düşük öncelikli ihtiyaçlar.</li>
                        </ul>
                        <p>İhtiyaçları karşılamak için "Halkın İhtiyaçları" sekmesine gidin ve "Yerine Getir" düğmesine tıklayın.</p>
                    </div>
                `
            },
            {
                title: "Olaylar ve Kararlar",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">5</span> Olaylar</div>
                        <p>Oyun sırasında çeşitli olaylar meydana gelecek ve sizden kararlar vermeniz istenecektir. Bu kararlar imparatorluğun geleceğini etkileyecektir.</p>
                        <p>Olaylar "Olaylar" sekmesinde görüntülenir. Her olay size farklı seçenekler sunar ve her seçeneğin farklı sonuçları olacaktır.</p>
                        <div class="tutorial-image">
                            <i class="fas fa-exclamation-triangle fa-3x"></i><br>
                            Olaylar temsili görsel
                        </div>
                        <div class="historical-note">
                            Osmanlı İmparatorluğu tarihinde kuraklık, salgın hastalık, savaşlar gibi birçok olay imparatorluğun geleceğini şekillendirmiştir.
                        </div>
                    </div>
                `
            },
            {
                title: "Yapıların Bakımı",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">6</span> Bakım</div>
                        <p>İnşa ettiğiniz yapıların zamanla bakıma ihtiyacı olacaktır. Bakımını yapmadığınız yapılar zamanla hasar görür ve verimliliği düşer.</p>
                        <p>Yapıların durumunu "Bakım" sekmesinden kontrol edebilirsiniz. Hasarlı yapıları onarmak için "Onar" düğmesine tıklayın.</p>
                        <p>Her yapının bakım maliyeti vardır ve bu maliyet her tur otomatik olarak kaynaklarınızdan düşülür. Yeterli kaynağınız yoksa yapılar hasar görmeye başlar.</p>
                    </div>
                `
            },
            {
                title: "Halk Fikirleri",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">7</span> Halk Fikirleri</div>
                        <p>Halkın fikirlerini "Halk Fikirleri" sekmesinden görüntüleyebilirsiniz. Bu fikirler size yeni öneriler sunar ve halkın isteklerini anlamanıza yardımcı olur.</p>
                        <p>Fikirlere oy vererek hangilerinin daha popüler olduğunu görebilirsiniz. Ayrıca kendi fikirlerinizi de gönderebilirsiniz.</p>
                        <div class="tutorial-image">
                            <i class="fas fa-lightbulb fa-3x"></i><br>
                            Halk fikirleri temsili görsel
                        </div>
                    </div>
                `
            },
            {
                title: "Oyun Kaydetme ve Yükleme",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">8</span> Oyun Kaydetme ve Yükleme</div>
                        <p>Oyun ilerleyişinizi kaydedebilir ve daha sonra kaldığınız yerden devam edebilirsiniz:</p>
                        <ul>
                            <li><strong>Oyunu Kaydet:</strong> Mevcut ilerlemenizi kaydetmek için sayfanın altındaki "Oyunu Kaydet" düğmesine tıklayın.</li>
                            <li><strong>Oyunu Yükle:</strong> Kaydedilmiş bir oyunu yüklemek için "Oyunu Yükle" düğmesine tıklayın.</li>
                            <li><strong>Oyunu Sıfırla:</strong> Yeni bir oyuna başlamak için "Oyunu Sıfırla" düğmesine tıklayın.</li>
                        </ul>
                        <p>Oyun otomatik olarak tarayıcınızın yerel depolama alanına kaydedilir.</p>
                    </div>
                `
            },
            {
                title: "Oyun Hedefleri",
                content: `
                    <div class="tutorial-step">
                        <div class="tutorial-step-title"><span class="tutorial-step-number">9</span> Oyun Hedefleri</div>
                        <p>Vakıf İmparatorluğu'nda ana hedefleriniz:</p>
                        <ul>
                            <li>Halkın ihtiyaçlarını karşılamak</li>
                            <li>Şehirleri geliştirmek ve yeni yapılar inşa etmek</li>
                            <li>İmparatorluğun refahını ve itibarını artırmak</li>
                            <li>Kaynaklarınızı verimli bir şekilde yönetmek</li>
                            <li>Tarihsel olayları kendi yönetim tarzınıza göre şekillendirmek</li>
                        </ul>
                        <p>Her bir kararınız imparatorluğun geleceğini etkileyecektir. Bilge ve adil bir yönetici olmaya çalışın!</p>
                        <div class="historical-note">
                            Osmanlı İmparatorluğu 600 yıldan fazla süren tarihi boyunca adalet, hoşgörü ve vakıf kültürü ile tanınmıştır.
                        </div>
                    </div>
                `
            },
            {
                title: "Rehber Tamamlandı",
                content: `
                    <div class="tutorial-step">
                        <h3>Tebrikler! Oyun rehberini tamamladınız.</h3>
                        <p>Artık Osmanlı İmparatorluğu'nda bir vakıf yöneticisi olarak görevinize başlayabilirsiniz. Unutmayın, her kararınız imparatorluğun geleceğini şekillendirecek.</p>
                        <p>İyi yönetimler dileriz!</p>
                        <div class="tutorial-image">
                            <i class="fas fa-star fa-3x"></i><br>
                            Rehber tamamlandı
                        </div>
                        <div class="historical-note">
                            "Adaletle hükmedin ki, memleket ma'mur olsun." - Osmanlı geleneği
                        </div>
                    </div>
                `
            }
        ];
        
        this.totalSteps = this.tutorialSteps.length;
    },
    
    /**
     * Start the tutorial
     */
    startTutorial: function() {
        // Initialize tutorial content if not already done
        if (this.tutorialSteps.length === 0) {
            this.initTutorialContent();
        }
        
        // Reset to the first step
        this.currentStep = 0;
        
        // Show tutorial modal
        utils.showModal('tutorial-modal');
        
        // Update tutorial content
        this.updateTutorialContent();
        
        // Update next button text
        const nextButton = document.getElementById('tutorial-next-btn');
        if (nextButton) {
            nextButton.textContent = 'İlerle';
        }
    },
    
    /**
     * Update tutorial content based on current step
     */
    updateTutorialContent: function() {
        const tutorialContent = document.getElementById('tutorial-content');
        if (!tutorialContent) return;
        
        const step = this.tutorialSteps[this.currentStep];
        if (!step) return;
        
        // Update content
        let content = `
            <h3>${step.title}</h3>
            <div class="tutorial-progress">
                Adım ${this.currentStep + 1}/${this.totalSteps}
            </div>
            ${step.content}
        `;
        
        tutorialContent.innerHTML = content;
        
        // Update next button text for last step
        const nextButton = document.getElementById('tutorial-next-btn');
        if (nextButton) {
            if (this.currentStep === this.totalSteps - 1) {
                nextButton.textContent = 'Tamamla';
            } else {
                nextButton.textContent = 'İlerle';
            }
        }
    },
    
    /**
     * Move to the next tutorial step
     */
    nextStep: function() {
        // Increment step
        tutorialNavigation.currentStep++;
        
        // If reached the end, close tutorial
        if (tutorialNavigation.currentStep >= tutorialNavigation.totalSteps) {
            tutorialNavigation.completeTutorial();
            return;
        }
        
        // Update content
        tutorialNavigation.updateTutorialContent();
    },
    
    /**
     * Complete the tutorial
     */
    completeTutorial: function() {
        // Hide modal
        utils.hideModal('tutorial-modal');
        
        // Mark tutorial as completed
        gameState.tutorialCompleted = true;
        
        // Log completion
        utils.log('Oyun rehberi tamamlandı. İyi oyunlar!');
    },
    
    /**
     * Move to the previous tutorial step
     */
    prevStep: function() {
        // Decrement step (but not below 0)
        tutorialNavigation.currentStep = Math.max(0, tutorialNavigation.currentStep - 1);
        
        // Update content
        tutorialNavigation.updateTutorialContent();
    },
    
    /**
     * Jump to a specific tutorial step
     * @param {number} stepIndex - Step index to jump to
     */
    goToStep: function(stepIndex) {
        // Validate step index
        if (stepIndex >= 0 && stepIndex < tutorialNavigation.totalSteps) {
            tutorialNavigation.currentStep = stepIndex;
            tutorialNavigation.updateTutorialContent();
        }
    },
    
    /**
     * Show a specific tutorial topic
     * @param {string} topic - Topic to show
     */
    showTopic: function(topic) {
        // Find the step index for the given topic
        const topicIndex = this.tutorialSteps.findIndex(step => 
            step.title.toLowerCase().includes(topic.toLowerCase())
        );
        
        if (topicIndex !== -1) {
            this.currentStep = topicIndex;
            utils.showModal('tutorial-modal');
            this.updateTutorialContent();
        }
    }
};

// Add event listener for tutorial accessibility
document.addEventListener('keydown', function(event) {
    // Check if tutorial is open
    const tutorialModal = document.getElementById('tutorial-modal');
    if (tutorialModal && tutorialModal.style.display === 'flex') {
        // Right arrow or space to go next
        if (event.key === 'ArrowRight' || event.key === ' ') {
            tutorialNavigation.nextStep();
            event.preventDefault();
        }
        // Left arrow to go back
        else if (event.key === 'ArrowLeft') {
            tutorialNavigation.prevStep();
            event.preventDefault();
        }
        // Escape to close
        else if (event.key === 'Escape') {
            tutorialNavigation.completeTutorial();
            event.preventDefault();
        }
    }
});
