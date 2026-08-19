# Словесные Былины (Word Epics)

Словесная головоломка в жанре славянского фэнтези для платформы Яндекс Игры.
A word puzzle game in Slavic fantasy genre for Yandex Games platform.

## О проекте | About

**RU:** Составляйте слова из букв, сражайтесь с персонажами славянского фольклора. 250+ уровней, боевой пропуск, ежедневные задания. 

**EN:** Form words from letters, battle characters from Slavic folklore. 250+ levels, battle pass, daily quests.

## Структура проекта | Project Structure

```
├── game/                    # Игра / Game
│   ├── index.html          # Главный файл / Main HTML
│   ├── css/style.css       # Стили / Styles
│   ├── js/
│   │   ├── main.js         # Основной цикл / Main loop
│   │   ├── localization.js # Локализация / Localization
│   │   ├── yandex.js       # Яндекс SDK / Yandex SDK
│   │   ├── levels.js       # Уровни / Levels (250+)
│   │   ├── combat.js       # Бой / Combat system
│   │   ├── battlepass.js   # Боевой пропуск / Battle Pass
│   │   └── audio.js        # Аудио / Audio system
│   ├── assets/             # Изображения / Images
│   └── metadata.json       # Метаданные / Metadata
├── CONCEPT.md              # Концепт-документ / Concept doc
└── INSTRUCTION.md          # Инструкция для ИИ / AI Instruction
```

## Технологии | Technologies

- HTML5 + CSS3 + JavaScript (Vanilla)
- Yandex Games SDK v3
- Web Audio API
- Responsive design (PC + Mobile)

## Запуск | Running

```bash
cd /home/user/yandexgame
python3 -m http.server 8080
# Открыть http://localhost:8080/game/
```

## Требования платформы | Platform Requirements

- ✅ Автоопределение языка через SDK (п. 2.14)
- ✅ Кроссплатформенность (ПК + мобильные)
- ✅ Canvas-free (HTML/CSS/JS)
- ✅ Внутриигровая реклама (rewarded + interstitial)
- ✅ Боевой пропуск (Free + Premium)