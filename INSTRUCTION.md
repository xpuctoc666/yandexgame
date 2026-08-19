# Инструкция по продолжению разработки игры «Словесные Былины»

## Состояние проекта ✅ (Финальное)
Проект полностью реализован. Игра готова к загрузке на Яндекс Игры.
**Игра полностью на русском языке** — это единственный язык игры.

## Структура проекта
```
/home/user/yandexgame/
├── game/                          # Игра
│   ├── index.html                — Главный HTML (SPA)
│   ├── css/
│   │   └── style.css             — Стили (славянский стиль)
│   ├── js/
│   │   ├── main.js               — Основной цикл, экраны, toast
│   │   ├── localization.js       — Тексты (только русский)
│   │   ├── yandex.js             — Яндекс SDK
│   │   ├── levels.js             — 250+ уровней, враги, слова
│   │   ├── combat.js             — Боевая система, доска букв
│   │   ├── battlepass.js         — Free/Premium боевые пропуски
│   │   └── audio.js              — Web Audio API звуки
│   ├── assets/                   — Сгенерированные изображения
│   │   ├── icon.png
│   │   ├── cover.png             — Обложка на русском
│   │   ├── firebird.png
│   │   ├── screenshot-battle.png
│   │   ├── screenshot-menu.png
│   │   └── levels-1-100.json     — Первые 100 уровней (структура)
│   └── metadata.json             — Метаданные (только русский)
├── CONCEPT.md                     — Концепт-документ (русский)
├── INSTRUCTION.md                 — Данный файл
├── README.md                      — Описание проекта
├── start_game.bat                 — Запуск на Windows (проверка Python)
└── word-epics-deploy.zip          — Архив для загрузки на Яндекс Игры
```

## Важно: язык игры
- Игра **только на русском языке**. Никакого английского.
- Переключатель языка удалён из настроек.
- Яндекс SDK: язык всегда русский (автоопределение с игнорированием других языков).

## Технические детали
- **SDK**: YaGames v3 (https://yastatic.net/games/sdk/v3/sdk-v3.js)
- **Автоопределение языка**: yandexSDK.getEnvironment() — всегда используем русский
- **Game Ready**: yandexSDk.features.LoadingAPI.ready()
- **Реклама**: rewarded video, interstitial
- **Хранение данных**: localStorage + облако Яндекс

## Что делать при продолжении
1. Проверить файлы в `/home/user/yandexgame/game/`
2. Запустить локальный сервер: `cd /home/user/yandexgame && python3 -m http.server 8080`
3. Открыть браузер: http://localhost:8080/game/
4. Для деплоя использовать `word-epics-deploy.zip`

## Ссылки
- Требования: https://yandex.ru/dev/games/doc/ru/concepts/requirements
- SDK: https://yandex.ru/dev/games/doc/ru/sdk
- Автоопределение языка: https://yandex.ru/dev/games/doc/ru/requirements/2/14

## Примечание
Если что-то сломалось — не паникуй. Все JS-файлы прошли синтаксическую проверку.
Основные функции экспортируются в window для HTML-вызова.
Игра работает как отдельном HTML-файлом, так и через Яндекс SDK.