// ============================================
// Основной файл — Main Game Logic
// Словесные Былины (Word Epics)
// ============================================

// Toast notification
function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(43,24,16,0.95);
            color: var(--color-cream, #FFF8DC);
            padding: 12px 24px;
            border-radius: 12px;
            border: 1px solid var(--color-gold, #FFD700);
            font-family: 'Georgia', serif;
            font-size: 16px;
            z-index: 9999;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            max-width: 90%;
            pointer-events: none;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2000);
}

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }

    // Update dynamic content when showing screens
    if (screenId === 'main-menu') {
        updateMenuStats();
    }
    if (screenId === 'level-select') {
        renderLevelGrid();
    }
    if (screenId === 'battlepass-screen') {
        renderBattlePass();
    }

    // Start/stop music based on screen
    if (screenId === 'main-menu' || screenId === 'level-select') {
        startMusic();
    } else if (screenId === 'battle-screen') {
        stopMusic();
        // Play combat ambient
    } else {
        stopMusic();
    }

    // Apply language to dynamic content
    if (typeof applyLanguage === 'function') {
        setTimeout(applyLanguage, 50);
    }
}

// Render level grid
function renderLevelGrid() {
    const grid = document.getElementById('level-grid');
    if (!grid) return;
    grid.innerHTML = '';

    initLevels();
    
    LEVELS.forEach((level, index) => {
        const div = document.createElement('div');
        div.className = 'level-item';
        
        const levelNum = index + 1;
        if (gameState.completedLevels[levelNum]) {
            div.classList.add('completed');
        } else if (levelNum === gameState.level) {
            div.classList.add('current');
        } else if (levelNum > gameState.level) {
            div.classList.add('locked');
        }

        if (level.enemy.isBoss) {
            div.classList.add('boss-level');
        }

        div.innerHTML = `
            <span class="level-number">${levelNum}</span>
            ${level.enemy.isBoss ? '<span class="level-star">👑</span>' : ''}
            <span style="font-size:16px;">${level.enemy.emoji}</span>
        `;

        if (levelNum <= gameState.level || gameState.completedLevels[levelNum]) {
            div.onclick = () => startLevel(levelNum);
        }

        grid.appendChild(div);
    });
}

// Handle window resize for responsive layout
function handleResize() {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Loading simulation
function simulateLoading() {
    const progress = document.getElementById('loading-progress');
    const loadingText = document.querySelector('.loading-text');
    let p = 0;
    
    const interval = setInterval(() => {
        p += Math.random() * 15 + 5;
        if (p > 100) p = 100;
        
        if (progress) progress.style.width = `${p}%`;
        
        if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showScreen('main-menu');
                initAudio();
                startMusic();
            }, 500);
        }
    }, 200);

    // Change loading text
    const texts = [
        'Заряжаются древние силы...',
        'Собираются былины...',
        'Призываются богатыри...',
        'Открываются врата...',
        'Добро пожаловать в славянский мир!'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
        textIndex++;
        if (textIndex < texts.length && loadingText) {
            loadingText.textContent = texts[textIndex];
        } else {
            clearInterval(textInterval);
        }
    }, 800);
}

// Initialize the game
async function init() {
    try {
        // Initialize Yandex SDK first
        await initYandexSDK();

        // Signal to Yandex Games that the game is ready
        if (yandexSDK && yandexSDK.features && yandexSDK.features.LoadingAPI) {
            yandexSDK.features.LoadingAPI.ready();
            console.log('[Yandex SDK] Game Ready signaled');
        }
    } catch (e) {
        console.warn('Yandex SDK init failed, continuing without it');
    }

    // Initialize localization
    initLocalization();

    // Initialize game state
    initGameState();

    // Init levels
    initLevels();

    // Init battle pass
    initBattlePass();

    // Handle resize
    handleResize();
    window.addEventListener('resize', handleResize);

    // Simulate loading
    simulateLoading();

    // Touch support for mobile
    document.addEventListener('touchstart', function() {
        // Re-enable audio context on iOS
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }, { once: true });

    console.log('🎮 Словесные Былины (Word Epics) initialized!');
    console.log(`🌐 Language: ${currentLang}`);
    console.log(`📊 Game State: Level ${gameState.level}, Coins: ${gameState.coins}`);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for use in HTML onclick handlers
window.showScreen = showScreen;
window.startLevel = startLevel;
window.selectCell = selectCell;
window.submitWord = submitWord;
window.useHint = useHint;
window.useUndo = useUndo;
window.useShuffle = useShuffle;
window.watchAdForBoost = watchAdForBoost;
window.retryLevel = retryLevel;
window.nextLevel = nextLevel;
window.showBattlePass = () => showScreen('battlepass-screen');
window.showDailyQuests = showDailyQuests;
window.closePopup = closePopup;
window.watchAd = watchAd;
window.unlockPremium = unlockPremium;
window.collectReward = collectReward;
window.toggleSound = toggleSound;
window.toggleMusic = toggleMusic;
window.resetProgress = resetProgress;