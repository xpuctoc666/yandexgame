// ============================================
// Боевой пропуск — Battle Pass System
// Словесные Былины (Word Epics)
// ============================================

const BATTLE_PASS_CONFIG = {
    maxLevel: 50,
    xpPerLevel: 10,
    premiumCost: 500,
    
    freeRewards: [
        { level: 1, icon: '🎨', nameKey: 'reward_skin', type: 'skin' },
        { level: 3, icon: '😊', nameKey: 'reward_emoji', type: 'emoji' },
        { level: 5, icon: '⚡', nameKey: 'reward_booster', type: 'booster' },
        { level: 7, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 50 },
        { level: 10, icon: '✨', nameKey: 'reward_golden_letters', type: 'golden_letters' },
        { level: 12, icon: '😄', nameKey: 'reward_emoji', type: 'emoji' },
        { level: 15, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 75 },
        { level: 18, icon: '⚡', nameKey: 'reward_booster', type: 'booster' },
        { level: 20, icon: '🎨', nameKey: 'reward_skin', type: 'skin' },
        { level: 22, icon: '😆', nameKey: 'reward_emoji', type: 'emoji' },
        { level: 25, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 100 },
        { level: 28, icon: '⚡', nameKey: 'reward_booster', type: 'booster' },
        { level: 30, icon: '✨', nameKey: 'reward_golden_letters', type: 'golden_letters' },
        { level: 33, icon: '😎', nameKey: 'reward_emoji', type: 'emoji' },
        { level: 35, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 150 },
        { level: 38, icon: '⚡', nameKey: 'reward_booster', type: 'booster' },
        { level: 40, icon: '🎨', nameKey: 'reward_skin', type: 'skin' },
        { level: 43, icon: '🤩', nameKey: 'reward_emoji', type: 'emoji' },
        { level: 45, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 200 },
        { level: 48, icon: '⚡', nameKey: 'reward_booster', type: 'booster' },
        { level: 50, icon: '🏆', nameKey: 'reward_golden_letters', type: 'golden_letters' }
    ],

    premiumRewards: [
        { level: 1, icon: '🌟', nameKey: 'reward_exclusive_skin', type: 'exclusive_skin' },
        { level: 2, icon: '💰', nameKey: 'reward_double_coins', type: 'double_coins' },
        { level: 4, icon: '⚡', nameKey: 'reward_xp_boost', type: 'xp_boost' },
        { level: 6, icon: '💎', nameKey: 'reward_mana_boost', type: 'mana_boost' },
        { level: 8, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 100 },
        { level: 10, icon: '🌟', nameKey: 'reward_exclusive_skin', type: 'exclusive_skin' },
        { level: 12, icon: '⏫', nameKey: 'reward_xp_boost', type: 'xp_boost' },
        { level: 14, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 150 },
        { level: 16, icon: '😍', nameKey: 'reward_rare_emoji', type: 'emoji' },
        { level: 18, icon: '💎', nameKey: 'reward_mana_boost', type: 'mana_boost' },
        { level: 20, icon: '🌟', nameKey: 'reward_exclusive_skin', type: 'exclusive_skin' },
        { level: 22, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 200 },
        { level: 24, icon: '⏫', nameKey: 'reward_xp_boost', type: 'xp_boost' },
        { level: 26, icon: '💎', nameKey: 'reward_mana_boost', type: 'mana_boost' },
        { level: 28, icon: '😍', nameKey: 'reward_rare_emoji', type: 'emoji' },
        { level: 30, icon: '🌟', nameKey: 'reward_exclusive_skin', type: 'exclusive_skin' },
        { level: 32, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 250 },
        { level: 34, icon: '⏫', nameKey: 'reward_xp_boost', type: 'xp_boost' },
        { level: 36, icon: '💎', nameKey: 'reward_mana_boost', type: 'mana_boost' },
        { level: 38, icon: '😍', nameKey: 'reward_rare_emoji', type: 'emoji' },
        { level: 40, icon: '🌟', nameKey: 'reward_exclusive_skin', type: 'exclusive_skin' },
        { level: 42, icon: '🪙', nameKey: 'reward_coins', type: 'coins', amount: 300 },
        { level: 44, icon: '⏫', nameKey: 'reward_xp_boost', type: 'xp_boost' },
        { level: 46, icon: '💎', nameKey: 'reward_mana_boost', type: 'mana_boost' },
        { level: 48, icon: '👑', nameKey: 'reward_rare_emoji', type: 'emoji' },
        { level: 50, icon: '🏅', nameKey: 'reward_exclusive_skin', type: 'exclusive_skin_last' }
    ]
};

// Battle pass state
let battlePassState = {
    freeLevel: 1,
    premiumLevel: 1,
    freeXP: 0,
    premiumXP: 0,
    premiumUnlocked: false,
    collectedFree: {},
    collectedPremium: {}
};

// Daily quests
const DAILY_QUESTS_CONFIG = [
    {
        id: 'complete_levels',
        nameKey: 'quest_complete_levels',
        icon: '⚔️',
        target: 3,
        reward: { xp: 10, coins: 20 }
    },
    {
        id: 'use_long_words',
        nameKey: 'quest_use_words',
        icon: '📝',
        target: 5,
        reward: { xp: 15, coins: 30 }
    },
    {
        id: 'watch_ad',
        nameKey: 'quest_watch_ad',
        icon: '📺',
        target: 1,
        reward: { xp: 20, coins: 15 }
    },
    {
        id: 'find_words_battle',
        nameKey: 'quest_find_words',
        icon: '🔍',
        target: 8,
        reward: { xp: 12, coins: 25 }
    },
    {
        id: 'earn_coins',
        nameKey: 'quest_earn_coins',
        icon: '🪙',
        target: 100,
        reward: { xp: 18, coins: 40 }
    }
];

let dailyQuests = {
    date: '',
    quests: [],
    completed: {}
};

function initBattlePass() {
    const saved = localStorage.getItem('battle_pass_state');
    if (saved) {
        try {
            battlePassState = JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to load battle pass state');
        }
    }

    const savedQuests = localStorage.getItem('daily_quests');
    if (savedQuests) {
        try {
            dailyQuests = JSON.parse(savedQuests);
        } catch (e) {
            console.warn('Failed to load daily quests');
        }
    }

    // Check if new day
    const today = new Date().toDateString();
    if (dailyQuests.date !== today) {
        generateDailyQuests();
    }

    renderBattlePass();
}

function generateDailyQuests() {
    const shuffled = [...DAILY_QUESTS_CONFIG].sort(() => Math.random() - 0.5);
    dailyQuests = {
        date: new Date().toDateString(),
        quests: shuffled.slice(0, 3),
        completed: {}
    };
    localStorage.setItem('daily_quests', JSON.stringify(dailyQuests));
}

function saveBattlePassState() {
    localStorage.setItem('battle_pass_state', JSON.stringify(battlePassState));
}

function addXP(amount, isPremium = false) {
    if (isPremium && battlePassState.premiumUnlocked) {
        battlePassState.premiumXP += amount;
        while (battlePassState.premiumXP >= BATTLE_PASS_CONFIG.xpPerLevel && 
               battlePassState.premiumLevel < BATTLE_PASS_CONFIG.maxLevel) {
            battlePassState.premiumXP -= BATTLE_PASS_CONFIG.xpPerLevel;
            battlePassState.premiumLevel++;
        }
    } else if (!isPremium) {
        battlePassState.freeXP += amount;
        while (battlePassState.freeXP >= BATTLE_PASS_CONFIG.xpPerLevel && 
               battlePassState.freeLevel < BATTLE_PASS_CONFIG.maxLevel) {
            battlePassState.freeXP -= BATTLE_PASS_CONFIG.xpPerLevel;
            battlePassState.freeLevel++;
        }
    }
    saveBattlePassState();
    renderBattlePass();
}

async function watchAd() {
    const adBtn = document.getElementById('rewarded-ad-btn');
    if (!adBtn) return;
    adBtn.disabled = true;
    adBtn.querySelector('.btn-text').textContent = '⏳...';

    try {
        const watched = await showRewardedAd();
        if (watched) {
            addXP(1);
            updateQuest('watch_ad', 1);
            showToast('📺 +1 XP!');
        }
    } catch (err) {
        console.warn('Ad error:', err);
    }

    adBtn.disabled = false;
    if (adBtn.querySelector('.btn-text')) {
        adBtn.querySelector('.btn-text').textContent = getText('watch_ad');
    }
}

function renderBattlePass() {
    // Update progress
    const freeProgress = (battlePassState.freeLevel / BATTLE_PASS_CONFIG.maxLevel) * 100;
    const premiumProgress = (battlePassState.premiumLevel / BATTLE_PASS_CONFIG.maxLevel) * 100;

    const freeFill = document.getElementById('free-progress-fill');
    const premiumFill = document.getElementById('premium-progress-fill');
    if (freeFill) freeFill.style.width = `${freeProgress}%`;
    if (premiumFill) premiumFill.style.width = `${premiumProgress}%`;

    const freeText = document.getElementById('free-progress-text');
    const premiumText = document.getElementById('premium-progress-text');
    if (freeText) freeText.textContent = `${battlePassState.freeLevel}/${BATTLE_PASS_CONFIG.maxLevel}`;
    if (premiumText) premiumText.textContent = `${battlePassState.premiumLevel}/${BATTLE_PASS_CONFIG.maxLevel}`;

    // Premium status
    const premiumStatus = document.getElementById('premium-status');
    if (premiumStatus) {
        if (battlePassState.premiumUnlocked) {
            premiumStatus.innerHTML = '<span data-lang="premium_track" style="color:#FFD700;">✨ ' + getText('premium_track') + '</span>';
        } else {
            premiumStatus.innerHTML = '<span data-lang="locked">🔒 ' + getText('locked') + '</span>';
        }
    }

    // Render rewards
    renderRewardList('free-rewards', BATTLE_PASS_CONFIG.freeRewards, 'free');
    renderRewardList('premium-rewards', BATTLE_PASS_CONFIG.premiumRewards, 'premium');
}

function renderRewardList(containerId, rewards, track) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const collected = track === 'free' ? battlePassState.collectedFree : battlePassState.collectedPremium;
    const currentLevel = track === 'free' ? battlePassState.freeLevel : battlePassState.premiumLevel;

    rewards.forEach(reward => {
        const div = document.createElement('div');
        div.className = 'reward-item';

        if (collected[reward.level]) {
            div.classList.add('collected');
        } else if (reward.level > currentLevel) {
            div.classList.add('locked');
        }

        div.innerHTML = `
            <span class="reward-level">${reward.level}</span>
            <span class="reward-icon">${reward.icon}</span>
            <span class="reward-name">${getText(reward.nameKey)}</span>
            ${reward.amount ? `<span class="reward-amount">+${reward.amount}</span>` : ''}
            ${!collected[reward.level] && reward.level <= currentLevel ? 
                `<button class="collect-btn" onclick="collectReward('${track}', ${reward.level})">${getText('collect')}</button>` : ''}
        `;

        container.appendChild(div);
    });
}

function collectReward(track, level) {
    const rewards = track === 'free' ? BATTLE_PASS_CONFIG.freeRewards : BATTLE_PASS_CONFIG.premiumRewards;
    const reward = rewards.find(r => r.level === level);
    if (!reward) return;

    if (track === 'free') {
        battlePassState.collectedFree[level] = true;
        if (reward.type === 'coins') {
            gameState.coins += (reward.amount || 0);
            saveGameState();
        }
    } else {
        battlePassState.collectedPremium[level] = true;
        if (reward.type === 'coins') {
            gameState.coins += (reward.amount || 0);
            saveGameState();
        }
        if (reward.type === 'double_coins') {
            gameState.doubleCoins = true;
            saveGameState();
        }
        if (reward.type === 'xp_boost') {
            gameState.xpBoost = true;
            saveGameState();
        }
        if (reward.type === 'mana_boost') {
            gameState.maxMana = 100;
            saveGameState();
        }
    }

    saveBattlePassState();
    renderBattlePass();
    updateMenuStats();
}

function unlockPremium() {
    if (battlePassState.premiumUnlocked) {
        showToast('✅ ' + getText('premium_track') + ' уже открыт!');
        return;
    }

    if (gameState.coins >= BATTLE_PASS_CONFIG.premiumCost) {
        gameState.coins -= BATTLE_PASS_CONFIG.premiumCost;
        battlePassState.premiumUnlocked = true;
        
        battlePassState.premiumLevel = Math.min(
            battlePassState.freeLevel,
            BATTLE_PASS_CONFIG.maxLevel
        );

        saveGameState();
        saveBattlePassState();
        renderBattlePass();
        updateMenuStats();
        showToast('🎉 ' + getText('premium_track') + ' открыт!');
    } else {
        showToast('❌ Не хватает монет. Нужно: ' + (BATTLE_PASS_CONFIG.premiumCost - gameState.coins));
    }
}

function showDailyQuests() {
    const popup = document.getElementById('quests-popup');
    if (!popup) return;
    const list = document.getElementById('quests-list');
    if (!list) return;
    list.innerHTML = '';

    dailyQuests.quests.forEach(quest => {
        const progress = dailyQuests.completed[quest.id] || 0;
        const completed = progress >= quest.target;

        const div = document.createElement('div');
        div.className = `quest-item ${completed ? 'completed' : ''}`;
        div.innerHTML = `
            <span class="quest-icon">${quest.icon}</span>
            <div class="quest-info">
                <div class="quest-name">${getText(quest.nameKey)}</div>
                <div class="quest-progress">${Math.min(progress, quest.target)}/${quest.target}</div>
            </div>
            <span class="quest-reward">+${quest.reward.xp} XP, +${quest.reward.coins} <span data-lang="coins">монет</span></span>
        `;

        list.appendChild(div);
    });

    popup.classList.add('active');
}

function closePopup() {
    document.querySelectorAll('.popup-overlay').forEach(p => p.classList.remove('active'));
}

function updateQuest(questId, amount = 1) {
    if (!dailyQuests.quests.some(q => q.id === questId)) return;

    dailyQuests.completed[questId] = (dailyQuests.completed[questId] || 0) + amount;
    
    const quest = dailyQuests.quests.find(q => q.id === questId);
    if (dailyQuests.completed[questId] >= quest.target) {
        gameState.coins += quest.reward.coins;
        addXP(quest.reward.xp);
        saveGameState();
        showToast('✅ Задание выполнено! +' + quest.reward.xp + ' XP');
    }

    localStorage.setItem('daily_quests', JSON.stringify(dailyQuests));
}