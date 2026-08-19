// ============================================
// Боевая система — Combat System
// Словесные Былины (Word Epics)
// ============================================

let currentLevel = null;
let currentEnemy = null;
let currentBoard = null;
let selectedCells = [];
let currentWord = '';
let foundWords = [];
let gameState = {
    level: 1,
    coins: 0,
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    doubleCoins: false,
    xpBoost: false,
    completedLevels: {},
    stars: {}
};

function initGameState() {
    const saved = localStorage.getItem('game_progress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            gameState = { ...gameState, ...parsed };
        } catch (e) {
            console.warn('Failed to load game state');
        }
    }
    updateMenuStats();
}

function saveGameState() {
    localStorage.setItem('game_progress', JSON.stringify(gameState));
    // Also try to save to Yandex cloud
    if (typeof saveProgress === 'function') {
        saveProgress(gameState);
    }
}

function updateMenuStats() {
    const levelEl = document.getElementById('menu-level');
    const coinsEl = document.getElementById('menu-coins');
    const passEl = document.getElementById('menu-pass-level');
    if (levelEl) levelEl.textContent = gameState.level;
    if (coinsEl) coinsEl.textContent = gameState.coins;
    if (passEl) passEl.textContent = battlePassState.freeLevel;
}

function startLevel(levelId) {
    initLevels();
    currentLevel = LEVELS[levelId - 1];
    if (!currentLevel) return;

    currentEnemy = { ...currentLevel.enemy };
    currentEnemy.currentHp = currentEnemy.hp;
    currentEnemy.maxHp = currentEnemy.hp;

    selectedCells = [];
    currentWord = '';
    foundWords = [];

    // Generate board
    currentBoard = generateBoardLetters(currentLevel);

    showScreen('battle-screen');
    renderBattle();
}

function renderBattle() {
    // Level info
    document.getElementById('battle-level').textContent = currentLevel.id;
    document.getElementById('battle-score').textContent = foundWords.length;

    // Enemy
    document.getElementById('enemy-sprite').textContent = currentEnemy.emoji;
    document.getElementById('enemy-name').textContent = getText(currentEnemy.name);
    
    const hpPercent = (currentEnemy.currentHp / currentEnemy.maxHp) * 100;
    document.getElementById('enemy-health-fill').style.width = `${hpPercent}%`;
    document.getElementById('enemy-hp-text').textContent = 
        `HP: ${currentEnemy.currentHp}/${currentEnemy.maxHp}`;

    // Player
    document.getElementById('player-health').textContent = gameState.hp;
    document.getElementById('player-mana').textContent = gameState.mana;

    // Letter board
    const board = document.getElementById('letter-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${currentLevel.board.cols}, 1fr)`;

    currentBoard.forEach((cell, index) => {
        const div = document.createElement('div');
        div.className = 'letter-cell';
        if (cell.selected) div.classList.add('selected');
        if (cell.special) div.classList.add('special');
        if (cell.used) div.classList.add('used');
        if (cell.golden) div.style.color = 'var(--color-gold)';
        div.textContent = cell.letter;
        div.dataset.index = index;
        div.onclick = () => selectCell(index);
        board.appendChild(div);
    });

    // Current word
    document.getElementById('current-word').textContent = currentWord || '...';

    // Found words
    const foundContainer = document.getElementById('found-words');
    foundContainer.innerHTML = '';
    foundWords.forEach(word => {
        const tag = document.createElement('span');
        tag.className = 'found-word-tag';
        tag.textContent = word;
        foundContainer.appendChild(tag);
    });

    // Update enemy sprite animation
    const enemySprite = document.getElementById('enemy-sprite');
    enemySprite.classList.remove('hit');
}

function selectCell(index) {
    const cell = currentBoard[index];
    if (!cell || cell.used) return;

    if (cell.selected) {
        // Deselect: remove from selection and all after it
        const selIndex = selectedCells.indexOf(index);
        if (selIndex !== -1) {
            const toRemove = selectedCells.splice(selIndex);
            toRemove.forEach(i => {
                currentBoard[i].selected = false;
            });
            currentWord = selectedCells.map(i => currentBoard[i].letter).join('');
        }
    } else if (selectedCells.length === 0 || isAdjacent(selectedCells[selectedCells.length - 1], index)) {
        // Select cell if adjacent to last
        cell.selected = true;
        selectedCells.push(index);
        currentWord += cell.letter;
    }

    renderBattle();
}

function isAdjacent(idx1, idx2) {
    const cols = currentLevel.board.cols;
    const r1 = Math.floor(idx1 / cols);
    const c1 = idx1 % cols;
    const r2 = Math.floor(idx2 / cols);
    const c2 = idx2 % cols;
    return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
}

function submitWord() {
    if (currentWord.length < currentLevel.minWordLength) {
        showToast(`⚠️ ${getText('no_word')} (мин. ${currentLevel.minWordLength} буквы)`);
        return;
    }

    // Check if word already found
    if (foundWords.includes(currentWord)) {
        showToast('⚠️ Слово уже использовано');
        clearSelection();
        return;
    }

    // Check if valid (simplified - accept any word of sufficient length)
    if (!isValidWord(currentWord)) {
        showToast(`❌ ${getText('word_not_found')}`);
        clearSelection();
        return;
    }

    // Calculate damage
    let damage = calculateDamage(currentWord, currentLevel);
    
    // Apply golden letter bonuses
    selectedCells.forEach(index => {
        if (currentBoard[index].golden) {
            damage *= 2;
        }
    });

    // Apply double coins boost from premium
    let coinsReward = currentLevel.rewards.coins;
    if (gameState.doubleCoins) {
        coinsReward *= 2;
        damage = Math.round(damage * 1.2);
    }

    // Deal damage
    currentEnemy.currentHp -= damage;
    if (currentEnemy.currentHp < 0) currentEnemy.currentHp = 0;

    // Animate hit
    const enemySprite = document.getElementById('enemy-sprite');
    enemySprite.classList.add('hit');
    setTimeout(() => enemySprite.classList.remove('hit'), 300);

    // Show damage
    showToast(`⚔️ ${damage} уронa!`);

    // Add word to found list
    foundWords.push(currentWord);
    currentWord = '';
    selectedCells = [];

    // Mark cells as used
    // Regen some mana
    gameState.mana = Math.min(gameState.maxMana, gameState.mana + 2);

    // Enemy turn
    if (currentEnemy.currentHp > 0) {
        setTimeout(() => enemyTurn(), 500);
    } else {
        // Victory!
        setTimeout(() => victory(), 500);
    }

    // Update quests
    updateQuest('use_long_words', 1);
    updateQuest('earn_coins', damage);

    renderBattle();
}

function clearSelection() {
    selectedCells.forEach(index => {
        currentBoard[index].selected = false;
    });
    selectedCells = [];
    currentWord = '';
    renderBattle();
}

function enemyTurn() {
    const damage = currentEnemy.power;
    gameState.hp -= damage;
    if (gameState.hp < 0) gameState.hp = 0;

    showToast(`💥 ${getText(currentEnemy.name)} наносит ${damage} урона!`);

    // Apply enemy ability if boss
    if (currentEnemy.isBoss && currentEnemy.ability) {
        useEnemyAbility(currentEnemy.ability);
    }

    if (gameState.hp <= 0) {
        showToast('💀 Вы погибли...');
        setTimeout(() => showScreen('level-select'), 1500);
    }

    renderBattle();
    updateMenuStats();
}

function useEnemyAbility(ability) {
    switch (ability) {
        case 'poison':
            // Poison a random letter cell
            const availCells = currentBoard.filter(c => !c.used);
            if (availCells.length > 0) {
                const target = availCells[Math.floor(Math.random() * availCells.length)];
                target.special = true;
                showToast('☠️ Клетка отравлена!');
            }
            break;
        case 'burn':
            // Burn a random row
            const row = Math.floor(Math.random() * currentLevel.board.rows);
            showToast(`🔥 Ряд ${row + 1} горит!`);
            // Mark cells in row
            for (let i = 0; i < currentLevel.board.cols; i++) {
                const idx = row * currentLevel.board.cols + i;
                if (currentBoard[idx] && !currentBoard[idx].used) {
                    currentBoard[idx].special = true;
                }
            }
            break;
        case 'shield':
            // Shield - heal some hp
            const heal = Math.round(currentEnemy.maxHp * 0.05);
            currentEnemy.currentHp = Math.min(currentEnemy.maxHp, currentEnemy.currentHp + heal);
            showToast(`🛡️ ${getText(currentEnemy.name)} восстанавливает ${heal} HP!`);
            break;
    }
}

function victory() {
    // Calculate rewards
    let coinsReward = currentLevel.rewards.coins + foundWords.length * 2;
    let xpReward = currentLevel.rewards.xp + Math.floor(foundWords.length / 2);

    if (gameState.doubleCoins) coinsReward *= 2;
    if (gameState.xpBoost) xpReward = Math.round(xpReward * 1.5);

    gameState.coins += coinsReward;
    
    // Mark level as completed
    gameState.completedLevels[currentLevel.id] = true;
    
    // Next level unlocked
    if (currentLevel.id >= gameState.level) {
        gameState.level = currentLevel.id + 1;
    }

    // Add XP to battle pass
    addXP(xpReward);

    // Update quests
    updateQuest('complete_levels', 1);
    updateQuest('earn_coins', coinsReward);
    if (foundWords.length >= 8) {
        updateQuest('find_words_battle', 1);
    }

    saveGameState();

    // Show victory
    document.getElementById('victory-coins').textContent = coinsReward;
    document.getElementById('victory-exp').textContent = xpReward;
    showScreen('victory-screen');

    // Show interstitial ad after victory on higher levels
    if (currentLevel.id >= 5 && currentLevel.id % 3 === 0) {
        setTimeout(() => showInterstitialAd(), 1000);
    }
}

function nextLevel() {
    const nextId = currentLevel.id + 1;
    if (nextId <= LEVELS.length) {
        startLevel(nextId);
    } else {
        showToast('🎉 Вы прошли все уровни!');
        showScreen('main-menu');
    }
}

function resetProgress() {
    if (confirm(getText('confirm_reset'))) {
        localStorage.removeItem('game_progress');
        localStorage.removeItem('battle_pass_state');
        localStorage.removeItem('daily_quests');
        gameState = {
            level: 1,
            coins: 0,
            hp: 100,
            maxHp: 100,
            mana: 50,
            maxMana: 50,
            doubleCoins: false,
            xpBoost: false,
            completedLevels: {},
            stars: {}
        };
        battlePassState = {
            freeLevel: 1,
            premiumLevel: 1,
            freeXP: 0,
            premiumXP: 0,
            premiumUnlocked: false,
            collectedFree: {},
            collectedPremium: {}
        };
        saveGameState();
        saveBattlePassState();
        updateMenuStats();
        renderBattlePass();
        showToast('🔄 Прогресс сброшен');
        showScreen('main-menu');
    }
}