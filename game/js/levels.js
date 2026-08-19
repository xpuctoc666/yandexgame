// ============================================
// Уровни и враги — Levels & Enemies
// Словесные Былины (Word Epics)
// ============================================

// Enemy definitions
const ENEMIES = {
    // Common enemies (appear regularly)
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

    // Bosses (every 10 levels)
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

// Word lists for generating letter boards
const WORD_BANK = {
    // Common Russian words by length
    easy: [
        'дом', 'лес', 'мир', 'дуб', 'сад', 'рот', 'нос', 'глаз',
        'ухо', 'рот', 'сон', 'ток', 'сок', 'рак', 'лак', 'мак',
        'река', 'гора', 'луна', 'зима', 'вера', 'рука', 'душа',
        'слово', 'сердце', 'дорога', 'дерево', 'чудеса', 'богатырь',
        'славяне', 'русичи', 'перун', 'велес', 'сварог', 'даждьбог'
    ],
    medium: [
        'берёза', 'калина', 'рябина', 'трава', 'цветы', 'роса',
        'утреня', 'вечер', 'звезда', 'месяц', 'солнце', 'небо',
        'облака', 'ветер', 'гроза', 'радуга', 'иней', 'снега',
        'славяне', 'былина', 'сказка', 'преданье', 'колдун',
        'чародей', 'вещунья', 'ладанка', 'оберег', 'наговор'
    ],
    hard: [
        'богатырство', 'чужеродец', 'странствие', 'превращение',
        'заколдованный', 'зачарованный', 'непобедимый', 'сокровенный',
        'древнерусский', 'православие', 'язычество', 'жертвоприношение',
        'воскресение', 'путешествие', 'приключение', 'бессмертие',
        'вдохновение', 'созерцание', 'рассвет', 'сумерки', 'полночь',
        'испытание', 'предназначение', 'откровение', 'повествование'
    ]
};

// Generate level data for 250+ levels
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
        let minWordLength = 2;

        // Determine difficulty
        if (levelNum <= 50) {
            difficulty = 'easy';
            minWordLength = 2;
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

        // Check for boss levels (every 10 levels)
        if (levelNum % 10 === 0) {
            isBoss = true;
            const bossKeys = enemyKeys.filter(k => ENEMIES[k].boss);
            enemyKey = bossKeys[(Math.floor(levelNum / 10) - 1) % bossKeys.length];
            minWordLength = Math.max(minWordLength, 4);
        } else {
            const commonKeys = enemyKeys.filter(k => !ENEMIES[k].boss);
            const poolIndex = levelNum % commonKeys.length;
            enemyKey = commonKeys[poolIndex];
        }

        const enemy = ENEMIES[enemyKey];
        const hpScale = isBoss ? 1 : 1 + (levelNum * 0.01);
        const powerScale = 1 + (levelNum * 0.005);

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
            rewards: {
                coins: 5 + levelNum,
                xp: 2 + Math.floor(levelNum / 5)
            }
        });
    }

    return levels;
}

// The levels array
let LEVELS = null;

function initLevels() {
    if (!LEVELS) {
        LEVELS = generateLevels();
    }
    return LEVELS;
}

// Get letters for a specific level board
function generateBoardLetters(level) {
    const totalCells = level.board.rows * level.board.cols;
    const letters = [];
    const wordList = WORD_BANK[level.difficulty] || WORD_BANK.easy;

    // Take some letters from relevant words
    const sourceWords = [];
    for (let i = 0; i < 3; i++) {
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        sourceWords.push(word);
    }

    const sourceText = sourceWords.join('').toUpperCase();

    // Fill board with letters from source words + random consonants/vowels
    const vowels = 'АЕЁИОУЫЭЮЯ';
    const consonants = 'БВГДЖЗЙКЛМНПРСТФХЦЧШЩЬЪ';

    for (let i = 0; i < totalCells; i++) {
        if (i < sourceText.length && Math.random() > 0.3) {
            letters.push(sourceText[i]);
        } else {
            // Random letter with vowel/consonant balance
            if (letters.filter(l => vowels.includes(l)).length / totalCells < 0.3) {
                letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
            } else {
                letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
            }
        }
    }

    // Shuffle
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    // Add some special letters for higher levels
    const specialPositions = new Set();
    if (level.id > 20) {
        const specialCount = Math.min(3, Math.floor(level.id / 20));
        while (specialPositions.size < specialCount) {
            specialPositions.add(Math.floor(Math.random() * totalCells));
        }
    }

    const result = letters.map((letter, index) => {
        const isSpecial = specialPositions.has(index);
        const isGolden = isSpecial && Math.random() > 0.5;
        return {
            letter,
            id: `cell-${index}`,
            special: isSpecial,
            golden: isGolden,
            used: false
        };
    });

    return result;
}

// Check if word exists in dictionary (simplified)
function isValidWord(word) {
    if (word.length < 2) return false;
    // In real implementation, this would check against a dictionary
    // For now, accept any word of 2+ letters
    const allWords = [...WORD_BANK.easy, ...WORD_BANK.medium, ...WORD_BANK.hard];
    return allWords.some(w => w.toUpperCase() === word.toUpperCase()) || word.length >= 2;
}

// Calculate damage based on word
function calculateDamage(word, level) {
    const length = word.length;
    let damage = length * 3;

    // Rare letters do more damage
    const rareLetters = 'ЪЬЭЮЯФХЦЧШЩ';
    for (const char of word.toUpperCase()) {
        if (rareLetters.includes(char)) {
            damage += 2;
        }
    }

    // Longer words get bonus
    if (length >= 5) damage *= 1.5;
    if (length >= 7) damage *= 2;

    return Math.round(damage);
}