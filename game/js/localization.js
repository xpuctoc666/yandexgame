// ============================================
// Локализация — Localization System
// Словесные Былины (Word Epics)
// ============================================

const LANG = {
    ru: {
        // Main Menu
        play: "Начать игру",
        battle_pass: "Боевой пропуск",
        settings: "Настройки",
        watch_ad: "Посмотреть рекламу (+1 уровень)",
        level: "Уровень",
        coins: "Монеты",
        pass_level: "Пропуск",
        select_level: "Выбор уровня",
        score: "Счёт",
        your_word: "Ваше слово",
        attack: "Атаковать!",
        victory: "Победа!",
        next_level: "Следующий уровень",
        back_to_menu: "К уровням",

        // Battle Pass
        free_track: "Бесплатный",
        premium_track: "Премиум",
        locked: "🔒 Закрыто",
        unlock_premium: "Открыть (500 монет)",
        daily: "Задания",
        daily_quests: "Ежедневные задания",
        collect: "Забрать",

        // Enemies
        enemy_leshy: "Леший",
        enemy_baba_yaga: "Баба-Яга",
        enemy_vodyanoi: "Водяной",
        enemy_kikimora: "Кикимора",
        enemy_domovoy: "Домовой",
        enemy_zmey: "Змей Горыныч",
        enemy_koschey: "Кощей Бессмертный",
        enemy_rusalka: "Русалка",
        enemy_upyr: "Упырь",
        enemy_nav: "Навь",
        enemy_solovey: "Соловей-Разбойник",
        enemy_svyatogor: "Святогор",
        enemy_vii: "Вий",
        enemy_firebird: "Жар-птица",
        enemy_morskoy: "Морской Царь",

        // Battle
        damage: "Урон",
        shield: "Щит",
        poison: "Отравление",
        heal: "Лечение",
        burn: "Горение",

        // General
        loading: "Заряжаются древние силы...",
        language: "Язык",
        sound: "Звук",
        music: "Музыка",
        reset: "Сбросить прогресс",
        confirm_reset: "Вы уверены? Весь прогресс будет потерян!",
        no_word: "Слишком короткое слово",
        word_not_found: "Такого слова нет",

        // Quests
        quest_complete_levels: "Пройдите {n} уровней",
        quest_use_words: "Составьте {n} слов длиной 5+ букв",
        quest_watch_ad: "Посмотрите рекламу",
        quest_find_words: "Найдите {n} слов за один бой",
        quest_earn_coins: "Заработайте {n} монет",

        // Battle Pass Rewards
        reward_skin: "Скин для букв",
        reward_emoji: "Эмодзи",
        reward_booster: "Бустер x2",
        reward_coins: "Монеты",
        reward_golden_letters: "Золотые буквы (постоянно)",
        reward_double_coins: "Удвоение монет",
        reward_exclusive_skin: "Эксклюзивный скин",
        reward_xp_boost: "Ускорение XP",
        reward_mana_boost: "Увеличение маны",
        reward_rare_emoji: "Редкий эмодзи",
    },
    en: {
        play: "Play",
        battle_pass: "Battle Pass",
        settings: "Settings",
        watch_ad: "Watch Ad (+1 level)",
        level: "Level",
        coins: "Coins",
        pass_level: "Pass",
        select_level: "Select Level",
        score: "Score",
        your_word: "Your word",
        attack: "Attack!",
        victory: "Victory!",
        next_level: "Next Level",
        back_to_menu: "Back to Levels",

        free_track: "Free",
        premium_track: "Premium",
        locked: "🔒 Locked",
        unlock_premium: "Unlock (500 coins)",
        daily: "Quests",
        daily_quests: "Daily Quests",
        collect: "Collect",

        enemy_leshy: "Leshy",
        enemy_baba_yaga: "Baba Yaga",
        enemy_vodyanoi: "Vodyanoi",
        enemy_kikimora: "Kikimora",
        enemy_domovoy: "Domovoy",
        enemy_zmey: "Zmey Gorynych",
        enemy_koschey: "Koschei the Immortal",
        enemy_rusalka: "Rusalka",
        enemy_upyr: "Upyr",
        enemy_nav: "Nav",
        enemy_solovey: "Nightingale Robber",
        enemy_svyatogor: "Svyatogor",
        enemy_vii: "Viy",
        enemy_firebird: "Firebird",
        enemy_morskoy: "Sea King",

        damage: "Damage",
        shield: "Shield",
        poison: "Poison",
        heal: "Heal",
        burn: "Burn",

        loading: "Ancient powers are loading...",
        language: "Language",
        sound: "Sound",
        music: "Music",
        reset: "Reset Progress",
        confirm_reset: "Are you sure? All progress will be lost!",
        no_word: "Word too short",
        word_not_found: "Word not found",

        quest_complete_levels: "Complete {n} levels",
        quest_use_words: "Form {n} words of 5+ letters",
        quest_watch_ad: "Watch an ad",
        quest_find_words: "Find {n} words in one battle",
        quest_earn_coins: "Earn {n} coins",

        reward_skin: "Letter Skin",
        reward_emoji: "Emoji",
        reward_booster: "Booster x2",
        reward_coins: "Coins",
        reward_golden_letters: "Golden Letters (permanent)",
        reward_double_coins: "Double Coins",
        reward_exclusive_skin: "Exclusive Skin",
        reward_xp_boost: "XP Boost",
        reward_mana_boost: "Mana Boost",
        reward_rare_emoji: "Rare Emoji",
    }
};

let currentLang = 'ru';

function getText(key) {
    const lang = LANG[currentLang] || LANG.ru;
    return lang[key] || key;
}

function getTextWithArgs(key, ...args) {
    let text = getText(key);
    args.forEach((arg, i) => {
        text = text.replace(`{${i}}`, arg);
    });
    return text;
}

function applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        el.textContent = getText(key);
    });
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('game_lang', lang);
    applyLanguage();
    // Update dynamic content
    if (typeof updateDynamicTexts === 'function') updateDynamicTexts();
}

function initLocalization() {
    const saved = localStorage.getItem('game_lang');
    if (saved) {
        currentLang = saved;
        document.getElementById('lang-select').value = saved;
    }
    applyLanguage();
}