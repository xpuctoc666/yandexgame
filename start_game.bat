@echo off
chcp 65001 >nul
title Словесные Былины — Запуск игры

echo ============================================
echo   СЛОВЕСНЫЕ БЫЛИНЫ
echo   Запуск локального сервера
echo ============================================
echo.

:: Проверка установки Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Python не найден!
    echo.
    echo Для запуска игры требуется Python 3.
    echo Скачайте его с https://www.python.org/downloads/
    echo.
    echo При установке обязательно отметьте галочку
    echo "Add Python to PATH" (Добавить Python в PATH).
    echo.
    pause
    exit /b 1
)

echo [OK] Python найден
python --version
echo.

:: Запуск сервера
echo Запуск сервера на http://localhost:8080
echo Откройте в браузере: http://localhost:8080/game/
echo Нажмите Ctrl+C для остановки сервера.
echo.
python -m http.server 8080

pause