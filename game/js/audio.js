// ============================================
// Аудио система — Audio System
// Словесные Былины (Word Epics)
// ============================================

// Audio context for procedural sound effects
let audioCtx = null;
let soundEnabled = true;
let musicEnabled = true;
let currentMusic = null;

function initAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('AudioContext not available');
    }

    const soundSetting = localStorage.getItem('sound_enabled');
    const musicSetting = localStorage.getItem('music_enabled');
    if (soundSetting !== null) soundEnabled = soundSetting === 'true';
    if (musicSetting !== null) musicEnabled = musicSetting === 'true';
    document.getElementById('sound-toggle').checked = soundEnabled;
    document.getElementById('music-toggle').checked = musicEnabled;
}

function toggleSound() {
    soundEnabled = document.getElementById('sound-toggle').checked;
    localStorage.setItem('sound_enabled', soundEnabled);
}

function toggleMusic() {
    musicEnabled = document.getElementById('music-toggle').checked;
    localStorage.setItem('music_enabled', musicEnabled);
    if (!musicEnabled && currentMusic) {
        currentMusic.pause();
        currentMusic = null;
    }
}

// Play procedural sound effects using Web Audio API
function playSound(type) {
    if (!soundEnabled || !audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    gain.gain.value = 0.1;

    switch (type) {
        case 'select':
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);
            break;

        case 'attack':
            oscillator.frequency.value = 300;
            oscillator.type = 'sawtooth';
            gain.gain.value = 0.15;
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.3);
            break;

        case 'victory':
            oscillator.frequency.value = 523;
            oscillator.type = 'sine';
            gain.gain.value = 0.15;
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
            // Second note
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.frequency.value = 659;
            osc2.type = 'sine';
            gain2.gain.value = 0.15;
            gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            osc2.start(audioCtx.currentTime + 0.2);
            osc2.stop(audioCtx.currentTime + 0.8);
            break;

        case 'enemy_hit':
            oscillator.frequency.value = 150;
            oscillator.type = 'square';
            gain.gain.value = 0.1;
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.2);
            break;

        case 'scroll':
            // Rustle sound - noise-like
            const bufferSize = audioCtx.sampleRate * 0.1;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.value = 0.05;
            noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            noise.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start(audioCtx.currentTime);
            break;

        case 'fire':
            // Crackling fire sound
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    if (!soundEnabled) return;
                    const osc = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    osc.connect(g);
                    g.connect(audioCtx.destination);
                    osc.frequency.value = 200 + Math.random() * 400;
                    osc.type = 'sine';
                    g.gain.value = 0.03;
                    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
                    osc.start(audioCtx.currentTime);
                    osc.stop(audioCtx.currentTime + 0.1);
                }, i * 100);
            }
            break;
    }
}

// Ambient background music simuation using oscillators
let musicInterval = null;

function startMusic() {
    if (!musicEnabled || !audioCtx || musicInterval) return;

    const notes = [
        { freq: 196, dur: 0.5 }, // G3
        { freq: 220, dur: 0.5 }, // A3
        { freq: 261, dur: 0.5 }, // C4
        { freq: 220, dur: 0.5 }, // A3
        { freq: 196, dur: 1.0 }, // G3
        { freq: 164, dur: 0.5 }, // E3
        { freq: 220, dur: 0.5 }, // A3
        { freq: 261, dur: 1.0 }, // C4
    ];

    let noteIndex = 0;

    function playNextNote() {
        if (!musicEnabled || !audioCtx) {
            clearInterval(musicInterval);
            musicInterval = null;
            return;
        }

        const note = notes[noteIndex % notes.length];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = note.freq;
        osc.type = 'triangle';
        gain.gain.value = 0.03;
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.dur + 0.1);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + note.dur + 0.1);
        noteIndex++;
    }

    musicInterval = setInterval(playNextNote, 1200);
    playNextNote();
}

function stopMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

// Placeholder for generated music prompts (these would be generated via AI tools)
const MUSIC_PROMPTS = {
    menu: "Epic Slavic folk music, medieval atmosphere, gusli and horn instruments, heroic and mystical, 120 BPM, key of D minor",
    battle: "Intense Slavic battle music, fast tempo, percussion, domra and zhaleika, dramatic tension, 140 BPM",
    victory: "Triumphant Slavic melody, firebird theme, rising crescendo, golden fanfares, 100 BPM"
};

// Sound effect prompts for AI generation
const SOUND_PROMPTS = {
    scroll: "Scroll unrolling, parchment rustling, medieval manuscript, gentle paper sound",
    snake: "Snake hissing, reptilian breath, mystical creature warning",
    fire: "Campfire crackling, wood burning, sparkling embers, cozy fireplace"
};