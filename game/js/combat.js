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
let currentMoves = 0;
let maxMoves = 0;
let lastSnapshot = null;
let enemyTurnTimeout = null;
let endTimeout = null;

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
    stars: {},
    boosts: { hint: 3, undo: 5, shuffle: 1 }
};

function initGameState() {
    const saved = localStorage.getItem('game_progress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            gameState = { ...gameState, ...parsed };
            // Гарантируем наличие бустов (для старых сохранений)
            if (!gameState.boosts) {
                gameState.boosts = { hint: 3, undo: 5, shuffle: 1 };
            }
        } catch (e) {
            console.warn('Failed to load game state');
        }
    }
    updateMenuStats();
}

function saveGameState() {
    localStorage.setItem('game_progress', JSON.stringify(gameState));
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
    lastSnapshot = null;
    maxMoves = currentLevel.maxMoves;
    currentMoves = maxMoves;

    // Полное восстановление здоровья перед боем
    gameState.hp = gameState.maxHp;
    gameState.mana = gameState.maxMana;

    // Генерация доски (всегда решаема)
    currentBoard = generateBoardLetters(currentLevel);

    showScreen('battle-screen');
    renderBattle();
}

function renderBattle() {
    // Информация об уровне
    document.getElementById('battle-level').textContent = currentLevel.id;
    document.getElementById('battle-score').textContent = foundWords.length;
    document.getElementById('battle-moves').textContent = currentMoves;

    // Враг
    document.getElementById('enemy-sprite').textContent = currentEnemy.emoji;
    document.getElementById('enemy-name').textContent = getText(currentEnemy.name);

    const hpPercent = (currentEnemy.currentHp / currentEnemy.maxHp) * 100;
    document.getElementById('enemy-health-fill').style.width = `${hpPercent}%`;
    document.getElementById('enemy-hp-text').textContent =
        `HP: ${currentEnemy.currentHp}/${currentEnemy.maxHp}`;

    // Игрок
    document.getElementById('player-health').textContent = gameState.hp;
    document.getElementById('player-mana').textContent = gameState.mana;

    // Доска букв
    const board = document.getElementById('letter-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${currentLevel.board.cols}, 1fr)`;

    currentBoard.forEach((cell, index) => {
        const div = document.createElement('div');
        div.className = 'letter-cell';
        if (cell.selected) div.classList.add('selected');
        if (cell.hint) div.classList.add('hint');
        if (cell.special) div.classList.add('special');
        if (cell.used) div.classList.add('used');
        if (cell.golden) div.style.color = 'var(--color-gold)';
        div.textContent = cell.letter;
        div.dataset.index = index;
        div.onclick = () => selectCell(index);
        board.appendChild(div);
    });

    // Текущее слово
    document.getElementById('current-word').textContent = currentWord || '...';

    // Найденные слова
    const foundContainer = document.getElementById('found-words');
    foundContainer.innerHTML = '';
    foundWords.forEach(word => {
        const tag = document.createElement('span');
        tag.className = 'found-word-tag';
        tag.textContent = word;
        foundContainer.appendChild(tag);
    });

    // Бусты
    renderBoostBar();

    // Кнопка атаки
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = currentWord.length < currentLevel.minWordLength;
    }

    // Анимация врага
    const enemySprite = document.getElementById('enemy-sprite');
    enemySprite.classList.remove('hit');
}

function renderBoostBar() {
    const hintEl = document.getElementById('hint-count');
    const undoEl = document.getElementById('undo-count');
    const shuffleEl = document.getElementById('shuffle-count');
    if (hintEl) hintEl.textContent = gameState.boosts.hint;
    if (undoEl) undoEl.textContent = gameState.boosts.undo;
    if (shuffleEl) shuffleEl.textContent = gameState.boosts.shuffle;

    const hintBtn = document.getElementById('boost-hint');
    const undoBtn = document.getElementById('boost-undo');
    const shuffleBtn = document.getElementById('boost-shuffle');
    if (hintBtn) hintBtn.disabled = gameState.boosts.hint <= 0;
    if (undoBtn) undoBtn.disabled = gameState.boosts.undo <= 0 || !lastSnapshot;
    if (shuffleBtn) shuffleBtn.disabled = gameState.boosts.shuffle <= 0;
}

// Выбор буквы: в любом порядке, выбранная «поднимается»
function selectCell(index) {
    const cell = currentBoard[index];
    if (!cell || cell.used) return;

    if (cell.selected) {
        // Повторное нажатие — отмена выбора и всего, что после него
        const selIndex = selectedCells.indexOf(index);
        if (selIndex !== -1) {
            const toRemove = selectedCells.splice(selIndex);
            toRemove.forEach(i => {
                currentBoard[i].selected = false;
            });
            currentWord = selectedCells.map(i => currentBoard[i].letter).join('');
            if (typeof playSound === 'function') playSound('select');
        }
    } else {
        // Любая клетка в любом порядке
        cell.selected = true;
        selectedCells.push(index);
        currentWord += cell.letter;
        if (typeof playSound === 'function') playSound('select');
    }

    renderBattle();
}

function submitWord() {
    if (currentWord.length < currentLevel.minWordLength) {
        showToast(`⚠️ ${getText('no_word')} (мин. ${currentLevel.minWordLength} буквы)`);
        return;
    }

    if (foundWords.includes(currentWord)) {
        showToast('⚠️ Слово уже использовано');
        clearSelection();
        return;
    }

    if (!isValidWord(currentWord)) {
        showToast(`❌ ${getText('word_not_found')}`);
        clearSelection();
        return;
    }

    // Снимок для буста «отмена»
    takeSnapshot();

    // Расчёт урона
    let damage = calculateDamage(currentWord, currentLevel);

    // Золотые буквы удваивают урон
    selectedCells.forEach(index => {
        if (currentBoard[index].golden) {
            damage *= 2;
        }
    });

    // Премиум-бонусы
    let coinsReward = currentLevel.rewards.coins;
    if (gameState.doubleCoins) {
        coinsReward *= 2;
        damage = Math.round(damage * 1.2);
    }

    // Наносим урон
    currentEnemy.currentHp -= damage;
    if (currentEnemy.currentHp < 0) currentEnemy.currentHp = 0;

    // Анимация удара
    const enemySprite = document.getElementById('enemy-sprite');
    enemySprite.classList.add('hit');
    setTimeout(() => enemySprite.classList.remove('hit'), 300);
    if (typeof playSound === 'function') playSound('attack');

    showToast(`⚔️ ${damage} урона!`);

    // Фиксируем слово
    foundWords.push(currentWord);

    // Использованные клетки заменяем новыми буквами
    const usedIndices = [...selectedCells];
    refillBoardLetters(usedIndices);

    currentWord = '';
    selectedCells = [];
    currentMoves--;

    // Немного маны
    gameState.mana = Math.min(gameState.maxMana, gameState.mana + 2);

    // Квесты
    updateQuest('use_long_words', 1);
    updateQuest('earn_coins', damage);

    renderBattle();

    if (currentEnemy.currentHp <= 0) {
        endTimeout = setTimeout(() => victory(), 500);
    } else {
        enemyTurnTimeout = setTimeout(() => enemyTurn(), 600);
    }
}

function clearSelection() {
    selectedCells.forEach(index => {
        currentBoard[index].selected = false;
    });
    selectedCells = [];
    currentWord = '';
    renderBattle();
}

function takeSnapshot() {
    lastSnapshot = {
        enemyHp: currentEnemy.currentHp,
        moves: currentMoves,
        foundWords: [...foundWords],
        board: currentBoard.map(c => ({
            letter: c.letter,
            special: c.special,
            golden: c.golden,
            used: c.used,
            selected: false
        })),
        playerHp: gameState.hp,
        mana: gameState.mana
    };
}

function useUndo() {
    if (gameState.boosts.undo <= 0) {
        showToast('🔒 Нет отмен! Посмотри рекламу, чтобы получить бусты.');
        return;
    }
    if (!lastSnapshot) {
        showToast('⚠️ Отменять нечего');
        return;
    }

    // Отменяем отложенные действия врага
    if (enemyTurnTimeout) { clearTimeout(enemyTurnTimeout); enemyTurnTimeout = null; }
    if (endTimeout) { clearTimeout(endTimeout); endTimeout = null; }

    const snap = lastSnapshot;
    currentEnemy.currentHp = snap.enemyHp;
    currentMoves = snap.moves;
    foundWords = snap.foundWords;
    gameState.hp = snap.playerHp;
    gameState.mana = snap.mana;
    snap.board.forEach((s, i) => {
        currentBoard[i].letter = s.letter;
        currentBoard[i].special = s.special;
        currentBoard[i].golden = s.golden;
        currentBoard[i].used = s.used;
        currentBoard[i].selected = false;
        currentBoard[i].hint = false;
    });
    selectedCells = [];
    currentWord = '';
    lastSnapshot = null;

    gameState.boosts.undo--;
    saveGameState();
    renderBattle();
    showToast('↩️ Ход отменён');
}

function useShuffle() {
    if (gameState.boosts.shuffle <= 0) {
        showToast('🔒 Нет перемешиваний! Посмотри рекламу, чтобы получить бусты.');
        return;
    }

    const letters = currentBoard.map(c => c.letter);
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    currentBoard.forEach((cell, i) => {
        cell.letter = letters[i];
        cell.selected = false;
        cell.hint = false;
    });
    selectedCells = [];
    currentWord = '';

    gameState.boosts.shuffle--;
    saveGameState();
    renderBattle();
    showToast('🔀 Буквы перемешаны');
}

function useHint() {
    if (gameState.boosts.hint <= 0) {
        showToast('🔒 Нет подсказок! Посмотри рекламу, чтобы получить бусты.');
        return;
    }

    const result = findFormableWord(currentBoard, currentLevel.minWordLength);
    if (!result) {
        showToast('🤔 Не нашёл слова на доске...');
        return;
    }

    // Подсвечиваем буквы подсказки
    currentBoard.forEach(c => { c.hint = false; });
    result.indices.forEach(idx => {
        currentBoard[idx].hint = true;
    });

    gameState.boosts.hint--;
    saveGameState();
    renderBattle();
    showToast(`💡 Подсказка: ${result.word}`);

    // Снимаем подсветку через пару секунд
    setTimeout(() => {
        currentBoard.forEach(c => { c.hint = false; });
        if (typeof renderBattle === 'function') renderBattle();
    }, 2500);
}

// Найти слово на доске, которое можно собрать (подмножество букв)
function findFormableWord(cells, minLen) {
    const available = cells.filter(c => !c.used);
    const count = {};
    available.forEach(c => {
        count[c.letter] = (count[c.letter] || 0) + 1;
    });

    const candidates = RUSSIAN_DICTIONARY.filter(w => w.length >= minLen);
    // Сортируем от длинных к коротким — подсказываем самое «дорогое» слово
    candidates.sort((a, b) => b.length - a.length);

    for (const word of candidates) {
        const need = {};
        for (const ch of word.toUpperCase()) {
            need[ch] = (need[ch] || 0) + 1;
        }
        let ok = true;
        for (const ch in need) {
            if ((count[ch] || 0) < need[ch]) { ok = false; break; }
        }
        if (!ok) continue;

        // Сопоставляем буквы слова с клетками
        const indices = [];
        const usedIdx = new Set();
        for (const ch of word.toUpperCase()) {
            const cellIndex = available.findIndex((c, i) =>
                !usedIdx.has(i) && c.letter === ch
            );
            if (cellIndex === -1) { ok = false; break; }
            usedIdx.add(cellIndex);
            indices.push(available[cellIndex].id ? parseInt(available[cellIndex].id.replace('cell-', ''), 10) : cellIndex);
        }
        if (!ok) continue;

        return { word: word.toUpperCase(), indices };
    }
    return null;
}

function enemyTurn() {
    const damage = currentEnemy.power;
    gameState.hp -= damage;
    if (gameState.hp < 0) gameState.hp = 0;

    showToast(`💥 ${getText(currentEnemy.name)} наносит ${damage} урона!`);

    // Способность босса
    if (currentEnemy.isBoss && currentEnemy.ability) {
        useEnemyAbility(currentEnemy.ability);
    }

    renderBattle();
    updateMenuStats();

    // Поражение: кончились ходы или здоровье
    if (gameState.hp <= 0 || currentMoves <= 0) {
        if (gameState.hp <= 0) {
            showToast('💀 Вы погибли...');
        } else {
            showToast('⏳ Ходы закончились!');
        }
        endTimeout = setTimeout(() => defeat(), 900);
    }
}

function useEnemyAbility(ability) {
    switch (ability) {
        case 'poison':
            const availCells = currentBoard.filter(c => !c.used && !c.special);
            if (availCells.length > 0) {
                const target = availCells[Math.floor(Math.random() * availCells.length)];
                target.special = true;
                showToast('☠️ Клетка отравлена!');
            }
            break;
        case 'burn':
            const row = Math.floor(Math.random() * currentLevel.board.rows);
            showToast(`🔥 Ряд ${row + 1} горит!`);
            for (let i = 0; i < currentLevel.board.cols; i++) {
                const idx = row * currentLevel.board.cols + i;
                if (currentBoard[idx] && !currentBoard[idx].used) {
                    currentBoard[idx].special = true;
                }
            }
            break;
        case 'shield':
            const heal = Math.round(currentEnemy.maxHp * 0.05);
            currentEnemy.currentHp = Math.min(currentEnemy.maxHp, currentEnemy.currentHp + heal);
            showToast(`🛡️ ${getText(currentEnemy.name)} восстанавливает ${heal} HP!`);
            break;
    }
}

function victory() {
    let coinsReward = currentLevel.rewards.coins + foundWords.length * 2;
    let xpReward = currentLevel.rewards.xp + Math.floor(foundWords.length / 2);

    if (gameState.doubleCoins) coinsReward *= 2;
    if (gameState.xpBoost) xpReward = Math.round(xpReward * 1.5);

    gameState.coins += coinsReward;
    gameState.completedLevels[currentLevel.id] = true;

    if (currentLevel.id >= gameState.level) {
        gameState.level = currentLevel.id + 1;
    }

    addXP(xpReward);

    updateQuest('complete_levels', 1);
    updateQuest('earn_coins', coinsReward);
    if (foundWords.length >= 8) {
        updateQuest('find_words_battle', 1);
    }

    saveGameState();

    document.getElementById('victory-coins').textContent = coinsReward;
    document.getElementById('victory-exp').textContent = xpReward;
    document.getElementById('victory-words').textContent = foundWords.length;
    if (typeof playSound === 'function') playSound('victory');
    showScreen('victory-screen');

    if (currentLevel.id >= 5 && currentLevel.id % 3 === 0) {
        setTimeout(() => showInterstitialAd(), 1000);
    }
}

function defeat() {
    saveGameState();
    document.getElementById('defeat-level').textContent = currentLevel.id;
    showScreen('defeat-screen');
}

function retryLevel() {
    startLevel(currentLevel.id);
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

// Просмотр рекламы ради бустов (в бою)
async function watchAdForBoost() {
    const btn = document.getElementById('boost-ad');
    if (btn) btn.disabled = true;
    try {
        const watched = await showRewardedAd();
        if (watched) {
            gameState.boosts.hint += 1;
            gameState.boosts.shuffle += 1;
            saveGameState();
            updateQuest('watch_ad', 1);
            showToast('📺 +1 💡 подсказка, +1 🔀 перемешивание!');
            renderBattle();
        }
    } catch (err) {
        console.warn('Ad error:', err);
    }
    if (btn) btn.disabled = false;
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
            stars: {},
            boosts: { hint: 3, undo: 5, shuffle: 1 }
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
