// ============================================
// Уровни и враги — Levels & Enemies
// Словесные Былины (Word Epics)
// ============================================

// Враги: 16 обычных + 7 боссов = 23 персонажа
const ENEMIES = {
    // --- Обычные враги (16) ---
    leshy: {
        id: 'leshy',
        name: 'enemy_leshy',
        emoji: '🌲',
        hp: 50,
        power: 5,
        desc: 'Хозяин леса, путает тропы'
    },
    kikimora: {
        id: 'kikimora',
        name: 'enemy_kikimora',
        emoji: '🧹',
        hp: 40,
        power: 4,
        desc: 'Болотная проказница'
    },
    vodyanoi: {
        id: 'vodyanoi',
        name: 'enemy_vodyanoi',
        emoji: '🌊',
        hp: 60,
        power: 6,
        desc: 'Владыка вод, топит корабли'
    },
    domovoy: {
        id: 'domovoy',
        name: 'enemy_domovoy',
        emoji: '🏠',
        hp: 35,
        power: 3,
        desc: 'Дух дома, вредный сосед'
    },
    rusalka: {
        id: 'rusalka',
        name: 'enemy_rusalka',
        emoji: '🧜‍♀️',
        hp: 45,
        power: 5,
        desc: 'Заманивает в омут'
    },
    upyr: {
        id: 'upyr',
        name: 'enemy_upyr',
        emoji: '🧛',
        hp: 55,
        power: 7,
        desc: 'Пьёт жизненную силу'
    },
    nav: {
        id: 'nav',
        name: 'enemy_nav',
        emoji: '👻',
        hp: 30,
        power: 8,
        desc: 'Тёмный дух из Нави'
    },
    solovey: {
        id: 'solovey',
        name: 'enemy_solovey',
        emoji: '🐦‍⬛',
        hp: 70,
        power: 9,
        desc: 'Свистом сбивает с ног'
    },
    ovinnik: {
        id: 'ovinnik',
        name: 'enemy_ovinnik',
        emoji: '🐓',
        hp: 48,
        power: 5,
        desc: 'Дух овина, шумит по ночам'
    },
    bannik: {
        id: 'bannik',
        name: 'enemy_bannik',
        emoji: '🧖',
        hp: 42,
        power: 4,
        desc: 'Дух бани, ошпаривает паром'
    },
    polevoy: {
        id: 'polevoy',
        name: 'enemy_polevoy',
        emoji: '🌾',
        hp: 52,
        power: 6,
        desc: 'Дух полей, сбивает с пути'
    },
    likho: {
        id: 'likho',
        name: 'enemy_likho',
        emoji: '👁️',
        hp: 65,
        power: 8,
        desc: 'Одноглазое Лихо, несёт беду'
    },
    chort: {
        id: 'chort',
        name: 'enemy_chort',
        emoji: '😈',
        hp: 58,
        power: 7,
        desc: 'Чёрт с рогами, лукавый бес'
    },
    vurdalak: {
        id: 'vurdalak',
        name: 'enemy_vurdalak',
        emoji: '🧟',
        hp: 62,
        power: 8,
        desc: 'Восставший из могилы кровосос'
    },
    shishiga: {
        id: 'shishiga',
        name: 'enemy_shishiga',
        emoji: '👺',
        hp: 44,
        power: 5,
        desc: 'Болотная нечисть, морочит путников'
    },
    morok: {
        id: 'morok',
        name: 'enemy_morok',
        emoji: '🌫️',
        hp: 50,
        power: 6,
        desc: 'Дух наваждения, туманит разум'
    },

    // --- Боссы (7) ---
    baba_yaga: {
        id: 'baba_yaga',
        name: 'enemy_baba_yaga',
        emoji: '🧙‍♀️',
        hp: 200,
        power: 15,
        desc: 'Летает в ступе, варит зелья',
        boss: true,
        ability: 'poison'
    },
    zmey: {
        id: 'zmey',
        name: 'enemy_zmey',
        emoji: '🐉',
        hp: 300,
        power: 20,
        desc: 'Трёхглавый огнедышащий дракон',
        boss: true,
        ability: 'burn'
    },
    koschey: {
        id: 'koschey',
        name: 'enemy_koschey',
        emoji: '💀',
        hp: 500,
        power: 25,
        desc: 'Бессмертный, пока цела игла',
        boss: true,
        ability: 'shield'
    },
    svyatogor: {
        id: 'svyatogor',
        name: 'enemy_svyatogor',
        emoji: '🗻',
        hp: 400,
        power: 30,
        desc: 'Богатырь-гора, несокрушим',
        boss: true,
        ability: 'shield'
    },
    morskoy: {
        id: 'morskoy',
        name: 'enemy_morskoy',
        emoji: '🧜‍♂️',
        hp: 350,
        power: 22,
        desc: 'Царь морской, топит в пучине',
        boss: true,
        ability: 'poison'
    },
    vii: {
        id: 'vii',
        name: 'enemy_vii',
        emoji: '👁️',
        hp: 450,
        power: 28,
        desc: 'Всё видит, всё знает',
        boss: true,
        ability: 'burn'
    },
    firebird: {
        id: 'firebird',
        name: 'enemy_firebird',
        emoji: '🦅',
        hp: 250,
        power: 18,
        desc: 'Огненная птица, ослепляет',
        boss: true,
        ability: 'burn'
    }
};

// Частотный алфавит для генерации досок (без Ё, Ъ, Ь — для чистоты букв)
const LETTER_POOL =
    'ААААААААА' +
    'ООООООООО' +
    'ЕЕЕЕЕЕЕЕ' +
    'ИИИИИИИ' +
    'ННННННН' +
    'ТТТТТТ' +
    'СССССС' +
    'РРРРРР' +
    'ВВВВВ' +
    'ЛЛЛЛЛ' +
    'ККККК' +
    'ММММ' +
    'ДДДД' +
    'ПППП' +
    'УУУУ' +
    'ЯЯЯ' +
    'ЫЫЫ' +
    'ЗЗЗ' +
    'БББ' +
    'ГГГ' +
    'ЧЧ' +
    'ЙЙ' +
    'ХХ' +
    'ЖЖ' +
    'ШШ' +
    'ЮЮ' +
    'ЦЦ' +
    'ЩЩ' +
    'ЭЭ' +
    'ФФ';

function randomLetter() {
    return LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)];
}

// Выбрать слово-цель из словаря, которое гарантированно соберётся на доске
function pickTargetWord(minLen, totalCells) {
    const maxLen = Math.min(8, totalCells);
    const candidates = RUSSIAN_DICTIONARY.filter(w =>
        w.length >= minLen && w.length <= maxLen
    );
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

// Гарантировать решаемость: записать буквы слова-цели в случайные разные клетки
function injectTargetWord(cells, minLen) {
    const totalCells = cells.length;
    const word = pickTargetWord(minLen, totalCells);
    if (!word) return;

    // Выбираем len(word) разных случайных клеток
    const indices = [...Array(totalCells).keys()];
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    for (let k = 0; k < word.length; k++) {
        const cell = cells[indices[k]];
        cell.letter = word[k].toUpperCase();
        cell.special = false;
        cell.golden = false;
        cell.used = false;
    }
}

// Генерация букв для доски уровня (доска всегда решаема)
function generateBoardLetters(level) {
    const totalCells = level.board.rows * level.board.cols;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
        cells.push({
            letter: randomLetter(),
            id: `cell-${i}`,
            special: false,
            golden: false,
            used: false,
            selected: false
        });
    }

    // Гарантируем, что на доске есть хотя бы одно слово из словаря
    injectTargetWord(cells, level.minWordLength);

    // Золотые и особые клетки для верхних уровней
    const specialCount = level.id > 20 ? Math.min(3, Math.floor(level.id / 20)) : 0;
    let placed = 0;
    while (placed < specialCount) {
        const idx = Math.floor(Math.random() * totalCells);
        const cell = cells[idx];
        if (!cell.special && !cell.golden) {
            if (Math.random() > 0.5) {
                cell.golden = true;
            } else {
                cell.special = true;
            }
            placed++;
        }
    }

    return cells;
}

// Пополнить использованные клетки новыми буквами (после составленного слова)
function refillBoardLetters(usedIndices) {
    usedIndices.forEach(index => {
        const cell = currentBoard[index];
        if (!cell) return;
        cell.letter = randomLetter();
        cell.special = false;
        cell.golden = false;
        cell.used = false;
        cell.selected = false;
    });

    // После пополнения снова гарантируем решаемость доски
    injectTargetWord(currentBoard, currentLevel.minWordLength);
}

// Проверка слова по словарю (только от 3 букв)
function isValidWord(word) {
    if (!word || word.length < 3) return false;
    return isInDictionary(word);
}

// Генерация данных уровней (250+)
function generateLevels() {
    const levels = [];
    const enemyKeys = Object.keys(ENEMIES);

    for (let i = 0; i < 250; i++) {
        const levelNum = i + 1;
        let enemyKey;
        let isBoss = false;
        let difficulty = 'easy';
        let boardCols = 5;
        let boardRows = 5;
        let minWordLength = 3;

        // Сложность по уровню
        if (levelNum <= 50) {
            difficulty = 'easy';
            minWordLength = 3;
            boardRows = 5;
        } else if (levelNum <= 100) {
            difficulty = 'easy';
            minWordLength = 3;
            boardRows = 5;
        } else if (levelNum <= 150) {
            difficulty = 'medium';
            minWordLength = 3;
            boardRows = 6;
        } else if (levelNum <= 200) {
            difficulty = 'medium';
            minWordLength = 4;
            boardRows = 6;
        } else {
            difficulty = 'hard';
            minWordLength = 4;
            boardRows = 6;
        }

        // Боссы каждые 10 уровней
        if (levelNum % 10 === 0) {
            isBoss = true;
            const bossKeys = enemyKeys.filter(k => ENEMIES[k].boss);
            enemyKey = bossKeys[(Math.floor(levelNum / 10) - 1) % bossKeys.length];
            minWordLength = Math.max(minWordLength, 4);
        } else {
            const commonKeys = enemyKeys.filter(k => !ENEMIES[k].boss);
            enemyKey = commonKeys[levelNum % commonKeys.length];
        }

        const enemy = ENEMIES[enemyKey];
        const hpScale = isBoss ? 1 : 1 + (levelNum * 0.01);
        const powerScale = 1 + (levelNum * 0.005);

        // Лимит ходов: 18 → 9 с ростом уровня
        const maxMoves = Math.max(9, 18 - Math.floor((levelNum - 1) / 10));

        levels.push({
            id: levelNum,
            enemyId: enemyKey,
            enemy: {
                ...enemy,
                hp: Math.round(enemy.hp * hpScale),
                power: Math.round(enemy.power * powerScale),
                isBoss
            },
            board: {
                cols: boardCols,
                rows: boardRows
            },
            difficulty,
            minWordLength,
            maxMoves,
            rewards: {
                coins: 5 + levelNum,
                xp: 2 + Math.floor(levelNum / 5)
            }
        });
    }

    return levels;
}

// Массив уровней
let LEVELS = null;

function initLevels() {
    if (!LEVELS) {
        LEVELS = generateLevels();
    }
    return LEVELS;
}

// Расчёт урона по слову
function calculateDamage(word, level) {
    const length = word.length;
    let damage = length * 3;

    // Редкие буквы дают больше урона
    const rareLetters = 'ЭЮЯФХЦЧШЩЫ';
    for (const char of word.toUpperCase()) {
        if (rareLetters.includes(char)) {
            damage += 2;
        }
    }

    // Бонус за длинные слова
    if (length >= 5) damage *= 1.5;
    if (length >= 7) damage *= 2;

    return Math.round(damage);
}
