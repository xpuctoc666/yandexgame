// ============================================
// Локализация — все тексты на русском языке
// Словесные Былины
// ============================================

const TEXTS = {
    // Главное меню
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

    // Боевой пропуск
    free_track: "Бесплатный",
    premium_track: "Премиум",
    locked: "🔒 Закрыто",
    unlock_premium: "Открыть (500 монет)",
    daily: "Задания",
    daily_quests: "Ежедневные задания",
    collect: "Забрать",

    // Враги
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

    // Боевые эффекты
    damage: "Урон",
    shield: "Щит",
    poison: "Отравление",
    heal: "Лечение",
    burn: "Горение",

    // Общее
    loading: "Заряжаются древние силы...",
    sound: "Звук",
    music: "Музыка",
    reset: "Сбросить прогресс",
    confirm_reset: "Вы уверены? Весь прогресс будет потерян!",
    no_word: "Слишком короткое слово",
    word_not_found: "Такого слова нет",

    // Задания
    quest_complete_levels: "Пройдите {0} уровней",
    quest_use_words: "Составьте {0} слов длиной 5+ букв",
    quest_watch_ad: "Посмотрите рекламу",
    quest_find_words: "Найдите {0} слов за один бой",
    quest_earn_coins: "Заработайте {0} монет",

    // Награды боевого пропуска
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
};

function getText(key) {
    return TEXTS[key] || key;
}

function getTextWithArgs(key, ...args) {
    let text = getText(key);
    args.forEach((arg, i) => {
        text = text.replace(`{${i}}`, String(arg));
    });
    return text;
}

function applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        el.textContent = getText(key);
    });
}

function initLocalization() {
    applyLanguage();
}