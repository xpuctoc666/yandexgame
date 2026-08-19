// ============================================
// Яндекс SDK Integration
// Словесные Былины (Word Epics)
// ============================================

let yandexSDK = null;
let yandexPlayer = null;
let isYandexReady = false;

// Initialize Yandex Games SDK
async function initYandexSDK() {
    try {
        if (typeof YaGames !== 'undefined') {
            yandexSDK = await YaGames.init();

            // Get player info
            yandexPlayer = await yandexSDK.getPlayer({ scopes: false });

            // Get environment for auto language detection (п.2.14 требований)
            const environment = await yandexSDK.getEnvironment();
            const lang = environment.i18n ? environment.i18n.lang : null;
            
            if (lang) {
                const detectedLang = lang.startsWith('ru') ? 'ru' : 'en';
                // Don't override user's manual choice in localStorage
                if (!localStorage.getItem('game_lang')) {
                    currentLang = detectedLang;
                    const langSelect = document.getElementById('lang-select');
                    if (langSelect) langSelect.value = detectedLang;
                    applyLanguage();
                    console.log('[Yandex SDK] Auto-detected language:', detectedLang);
                }
            }

            isYandexReady = true;
            console.log('[Yandex SDK] Initialized successfully');
        } else {
            console.log('[Yandex SDK] Not available (running outside Yandex)');
        }
    } catch (err) {
        console.warn('[Yandex SDK] Init error:', err.message);
    }
}

// Save progress to Yandex cloud
async function saveProgress(data) {
    try {
        if (yandexPlayer) {
            await yandexPlayer.setData({
                game_progress: JSON.stringify(data)
            });
            console.log('[Yandex SDK] Progress saved');
        }
        // Also save to localStorage as fallback
        localStorage.setItem('game_progress', JSON.stringify(data));
    } catch (err) {
        console.warn('[Yandex SDK] Save error:', err.message);
        // Fallback to localStorage
        localStorage.setItem('game_progress', JSON.stringify(data));
    }
}

// Load progress from Yandex cloud
async function loadProgress() {
    try {
        if (yandexPlayer) {
            const data = await yandexPlayer.getData();
            if (data && data.game_progress) {
                console.log('[Yandex SDK] Progress loaded from cloud');
                return JSON.parse(data.game_progress);
            }
        }
        // Fallback to localStorage
        const local = localStorage.getItem('game_progress');
        if (local) {
            console.log('[Yandex SDK] Progress loaded from localStorage');
            return JSON.parse(local);
        }
    } catch (err) {
        console.warn('[Yandex SDK] Load error:', err.message);
        const local = localStorage.getItem('game_progress');
        if (local) {
            return JSON.parse(local);
        }
    }
    return null;
}

// Show rewarded ad
async function showRewardedAd() {
    try {
        if (yandexSDK) {
            const ad = await yandexSDK.adv.showRewardedVideo();
            await ad.callback();
            console.log('[Yandex SDK] Rewarded ad watched');
            return true;
        } else {
            // Simulate ad for development
            console.log('[Yandex SDK] Simulating ad watch');
            return new Promise(resolve => {
                setTimeout(() => resolve(true), 1000);
            });
        }
    } catch (err) {
        console.warn('[Yandex SDK] Ad error:', err.message);
        return false;
    }
}

// Show interstitial ad between levels
async function showInterstitialAd() {
    try {
        if (yandexSDK) {
            await yandexSDK.adv.showInterstitial();
            console.log('[Yandex SDK] Interstitial ad shown');
        }
    } catch (err) {
        console.warn('[Yandex SDK] Interstitial error:', err.message);
    }
}

// Show banner ad
async function showBannerAd() {
    try {
        if (yandexSDK) {
            await yandexSDK.adv.showBanner();
        }
    } catch (err) {
        console.warn('[Yandex SDK] Banner error:', err.message);
    }
}

// Rate game
async function rateGame() {
    try {
        if (yandexSDK) {
            await yandexSDK.features.rating.showRating();
        }
    } catch (err) {
        console.warn('[Yandex SDK] Rating error:', err.message);
    }
}

// Review the game
async function reviewGame() {
    try {
        if (yandexSDK) {
            await yandexSDK.features.review.requestReview();
        }
    } catch (err) {
        console.warn('[Yandex SDK] Review error:', err.message);
    }
}