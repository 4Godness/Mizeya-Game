import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sulawesi.css';
import './pixel-splash.css';
import './d-pad.css';
import playerDown from './Aset Images/playerDown.gif';
import playerUp from './Aset Images/playerUp.gif';
import playerLeft from './Aset Images/playerLeft.gif';
import playerRight from './Aset Images/playerRight.gif';
import playerDiam from './Aset Images/playerDiam.png';
import gameMusic from './Aset Images/audio/GameMusik.mp3';

function PixelSplashScreen({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`splash-screen`}>
            <div className="pixel-decoration"></div>
            <div className="pixel-decoration"></div>
            <div className="pixel-decoration"></div>
            <div className="pixel-decoration"></div>

            <div className="welcome-text">
                <div className="main-text">HALLO</div>
                <div className="sub-text">SELAMAT DATANG DI Sulawesi</div>
            </div>

            <div className="loading-container">
                <div className="loading-text">LOADING GAME...</div>
                <div className="loading-bar">
                    <div className="loading-fill"></div>
                </div>
            </div>

            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className={`particle ${i % 2 === 1 ? 'odd' : ''}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 6}s`,
                        animationDuration: `${Math.random() * 4 + 4}s`
                    }}
                />
            ))}
        </div>
    );
}

function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const { playerName = 'Player' } = location.state || {};
    const [showSplash, setShowSplash] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showItemChoice, setShowItemChoice] = useState(false);
    const [currentItemChoice, setCurrentItemChoice] = useState(null);
    const [showActivityAnimationModal, setShowActivityAnimationModal] = useState(false);
    const [animationData, setAnimationData] = useState(null);
    const [statNotifications, setStatNotifications] = useState([]);
    const [showDPad, setShowDPad] = useState(true);
    const [pressedKeys, setPressedKeys] = useState({});
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [musicVolume, setMusicVolume] = useState(0.5);
    const [activityJustClosed, setActivityJustClosed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90); // 90 detik = 1.5 menit
    const [isGameOver, setIsGameOver] = useState(false);

    const audioRef = useRef(null);

    const points = [
        {
            id: 'Resort', x: 470, y: 700, name: 'Resort', color: '#4caf50',
            activities: [
                { name: 'Nginep di Resort', duration: 5000, stat: { happiness: +10, energy: +15 }, icon: '🏚️' },
                { name: 'Main Pasir', duration: 4000, stat: { happiness: +15, energy: -5 }, icon: '⛱️' },
                { name: 'Sarapan', duration: 3000, stat: { food: +15 }, icon: '🥗', item: 'Sarapan' },
                { name: 'Berenang', duration: 3000, stat: { energy: -10, kebersihan: -5 }, icon: '😎', item: 'Berenang' }
            ]
        },
        {
            id: 'Masjid', x: 400, y: 280, name: 'Masjid', color: '#2196f3',
            activities: [
                { name: 'Beribadah', duration: 7000, stat: { happiness: +15, }, icon: '🤲🏻' },
                { name: 'Foto-Foto', duration: 5000, stat: { happiness: +10, energy: -5 }, icon: '📹' },
                { name: 'Minum Boba', duration: 4000, stat: { energy: +10 }, icon: '🧋', item: 'Minum Boba' }
            ]
        },
        {
            id: 'Patung Yesus', x: 1050, y: 530,name: 'Patung Yesus', color: '#ff9800',
            activities: [
                { name: 'Berdoa', duration: 8000, stat: { knowledge: +25, energy: -10 }, icon: '🙏' },
                { name: 'Melihat Pemandangan', duration: 6000, stat: { happiness: +5, energy: -10 }, icon: '🔭', requiredItem: 'Melihat Pemandangan' }
            ]
        },
    ];

    const shopItems = [
        { name: '🍞Roti', cost: 10 },
        { name: '🍣Sushi', cost: 20 },
        { name: '🍔burger', cost: 15 },
        { name: '🧸', cost: 10 },
        { name: '🧹Sapu', cost: 15 },
        { name: '☂️payung', cost: 20 },
        { name: '👜Tas', cost: 20 },
        { name: '🧴Sunscreen', cost: 15 },
        { name: '💐Flower', cost: 8}
    ];

    const [avatarPos, setAvatarPos] = useState({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    });
    const [nearPoint, setNearPoint] = useState(null);
    const [stats, setStats] = useState({
        food: 0, energy: 100, clean: 0, happiness: 0, knowledge: 0, coin: 100
    });
    const [isWorking, setIsWorking] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressColor, setProgressColor] = useState('#ccc');
    const [inventory, setInventory] = useState([]);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [showActivityMenu, setShowActivityMenu] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [mode, setMode] = useState('normal');
    const [avatarDirection, setAvatarDirection] = useState('down');
    const [isMoving, setIsMoving] = useState(false);
    const [showShop, setShowShop] = useState(false);

    const intervalRef = useRef(null);
    const keysPressed = useRef(new Set());
    const statusTimeoutRef = useRef(null);
    const moveIntervalRef = useRef(null);

    const [activityHistory, setActivityHistory] = useState([]);
    const [visitedLocations, setVisitedLocations] = useState(new Set());
    const [usedItems, setUsedItems] = useState([]);
    const [lifeScore, setLifeScore] = useState(0);

    useEffect(() => {
        if (gameStarted && !isGameOver) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsGameOver(true);
                        setStatusMessage('');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameStarted, isGameOver]);


    useEffect(() => {
        audioRef.current = new Audio(gameMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = musicVolume;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isMusicPlaying) {
            audioRef.current.play().catch(error => {
                console.error("Audio playback failed:", error);
                setIsMusicPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isMusicPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = musicVolume;
        }
    }, [musicVolume]);

    useEffect(() => {
        function calculateLifeScore() {
            const statValues = Object.values(stats);
            const avgStat = statValues.reduce((a, b) => a + b, 0) / statValues.length;
            const minStatPenalty = statValues.filter(val => val < 30).length * -5;

            const activityScore = activityHistory.length * 2;
            const itemScore = inventory.length + usedItems.length * 2;
            const locationScore = visitedLocations.size * 5;

            const score = Math.round(avgStat + activityScore + itemScore + locationScore + minStatPenalty);
            setLifeScore(score);
        }

        calculateLifeScore();
    }, [stats, activityHistory, inventory, usedItems, visitedLocations]);


    const toggleMusic = () => {
        setIsMusicPlaying(!isMusicPlaying);
    };

    const handleVolumeChange = (e) => {
        setMusicVolume(parseFloat(e.target.value));
    };

    const cleanup = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
            statusTimeoutRef.current = null;
        }
        if (moveIntervalRef.current) {
            clearInterval(moveIntervalRef.current);
            moveIntervalRef.current = null;
        }
    };

    useEffect(() => {
        function handleKeyDown(e) {
            if (isWorking) return;

            const key = e.key.toLowerCase();
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
                e.preventDefault();
                keysPressed.current.add(key);
                setPressedKeys(prev => ({ ...prev, [key]: true }));

                if (key === 'arrowup' || key === 'w') setAvatarDirection('up');
                else if (key === 'arrowdown' || key === 's') setAvatarDirection('down');
                else if (key === 'arrowleft' || key === 'a') setAvatarDirection('left');
                else if (key === 'arrowright' || key === 'd') setAvatarDirection('right');

                setIsMoving(true);
                startMovement();
            }
        }

        function handleKeyUp(e) {
            const key = e.key.toLowerCase();
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
                e.preventDefault();
                keysPressed.current.delete(key);
                setPressedKeys(prev => ({ ...prev, [key]: false }));

                if (keysPressed.current.size === 0) {
                    setIsMoving(false);
                    stopMovement();
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            stopMovement();
        };
    }, [isWorking]);

    const startMovement = () => {
        if (moveIntervalRef.current) return;

        moveIntervalRef.current = setInterval(() => {
            setAvatarPos(pos => {
                let { x, y } = pos;
                const speed = 5;

                if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) y -= speed;
                if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) y += speed;
                if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) x -= speed;
                if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) x += speed;

                return { x, y };
            });
        }, 20);
    };

    const stopMovement = () => {
        if (moveIntervalRef.current) {
            clearInterval(moveIntervalRef.current);
            moveIntervalRef.current = null;
        }
    };

    const handleDPadPress = (direction) => {
        if (isWorking) return;

        let key;
        switch (direction) {
            case 'up':
                key = 'arrowup';
                break;
            case 'down':
                key = 'arrowdown';
                break;
            case 'left':
                key = 'arrowleft';
                break;
            case 'right':
                key = 'arrowright';
                break;
            default:
                return;
        }

        keysPressed.current.add(key);
        setPressedKeys(prev => ({ ...prev, [key]: true }));
        setAvatarDirection(direction);
        setIsMoving(true);
        startMovement();
    };

    const handleDPadRelease = (direction) => {
        let key;
        switch (direction) {
            case 'up':
                key = 'arrowup';
                break;
            case 'down':
                key = 'arrowdown';
                break;
            case 'left':
                key = 'arrowleft';
                break;
            case 'right':
                key = 'arrowright';
                break;
            default:
                return;
        }

        keysPressed.current.delete(key);
        setPressedKeys(prev => ({ ...prev, [key]: false }));

        if (keysPressed.current.size === 0) {
            setIsMoving(false);
            stopMovement();
        }
    };

    const getDPadButtonClass = (direction) => {
        let baseClass = 'd-pad-button';
        let isPressed = false;

        switch (direction) {
            case 'up':
                isPressed = pressedKeys['arrowup'] || pressedKeys['w'];
                break;
            case 'down':
                isPressed = pressedKeys['arrowdown'] || pressedKeys['s'];
                break;
            case 'left':
                isPressed = pressedKeys['arrowleft'] || pressedKeys['a'];
                break;
            case 'right':
                isPressed = pressedKeys['arrowright'] || pressedKeys['d'];
                break;
        }

        if (isPressed) {
            baseClass += ` ${direction}-pressed`;
        }

        return baseClass;
    };

    useEffect(() => {
        const found = points.find(p =>
            Math.abs(p.x - avatarPos.x) < 80 &&
            Math.abs(p.y - avatarPos.y) < 80
        );
        setNearPoint(found || null);
    }, [avatarPos, points]);

    useEffect(() => {
        if (nearPoint && !isWorking && !activityJustClosed) {
            setShowActivityMenu(true);
        }
    }, [nearPoint, isWorking, activityJustClosed]);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    function getAvatarImage() {
        if (isWorking) return playerDiam;
        if (!isMoving) return playerDiam;

        switch (avatarDirection) {
            case 'up': return playerUp;
            case 'down': return playerDown;
            case 'left': return playerLeft;
            case 'right': return playerRight;
            default: return playerDiam;
        }
    }

    function showStatNotification(message) {
        const id = Date.now();
        setStatNotifications(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setStatNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }

    function applyStats(stat) {
        setStats(prev => {
            const updated = { ...prev };
            for (const key in stat) {
                updated[key] = Math.max(0, (updated[key] || 0) + stat[key]);
            }
            return updated;
        });

        // Create detailed stat change message
        const changes = Object.entries(stat).map(([key, value]) => {
            const statNames = {
                food: '🍞 Makanan',
                energy: '⚡ Energi',
                clean: '🧼 Kebersihan',
                happiness: '😊 Kebahagiaan',
                knowledge: '📘 Pengetahuan',
                coin: '💰 Coin'
            };
            return `${statNames[key] || key}: ${value > 0 ? '+' : ''}${value}`;
        }).join(', ');

        showStatNotification(changes);
    }

    const displayActivityAnimation = (activity) => {
        setAnimationData({
            icon: activity.icon,
            name: activity.name
        });
        setShowActivityAnimationModal(true);

        setTimeout(() => {
            setShowActivityAnimationModal(false);
            setAnimationData(null);
        }, 3000);
    }

    function finishActivity(message, activity) {
        cleanup();
        setIsWorking(false);
        setProgress(0);
        setCurrentActivity(null);
        setAvatarDirection('down');

        if (activity?.item) {
            setCurrentItemChoice({
                item: activity.item,
                activity: activity,
                message: message
            });
            setShowItemChoice(true);
        } else {
            // Show detailed activity completion message
            const statDetails = Object.entries(activity.stat).map(([key, value]) => {
                const statNames = {
                    food: '🍞 Makanan',
                    energy: '⚡ Energi',
                    clean: '🧼 Kebersihan',
                    happiness: '😊 Kebahagiaan',
                    knowledge: '📘 Pengetahuan'
                };
                return `${statNames[key] || key} ${value > 0 ? '+' : ''}${value}`;
            }).join(', ');

            setStatusMessage(`${message} (${statDetails})`);

            statusTimeoutRef.current = setTimeout(() => {
                setStatusMessage('');
                statusTimeoutRef.current = null;
            }, 3000);
        }
    }

    function handleItemChoice(choice, item) {
        setShowItemChoice(false);

        if (choice === 'save') {
            setInventory(prev => [...prev, item]);
            setStatusMessage(`Kamu menyimpan ${item} ke inventory!`);
        } else if (choice === 'use') {
            if (item === 'Roti') {
                applyStats({ food: 5 });
                setStatusMessage(`Kamu langsung makan ${item}. 🍞 Makanan +5`);
            } else if (item === 'Sapu') {
                applyStats({ clean: 10 });
                setStatusMessage(`Kamu langsung menggunakan ${item}. 🧼 Kebersihan +10`);
            }
        }

        statusTimeoutRef.current = setTimeout(() => {
            setStatusMessage('');
            statusTimeoutRef.current = null;
        }, 3000);

        setCurrentItemChoice(null);
    }


    function calculateLifeScore() {
        const statValues = Object.values(stats);
        const avgStat = statValues.reduce((a, b) => a + b, 0) / statValues.length;
        const minStatPenalty = statValues.filter(val => val < 30).length * -5;

        const activityScore = activityHistory.length * 2;
        const itemScore = inventory.length + usedItems.length * 2;
        const locationScore = visitedLocations.size * 5;

        const score = Math.round(avgStat + activityScore + itemScore + locationScore + minStatPenalty);
        setLifeScore(score);
    }


    function startActivity(activity) {
        if (!nearPoint || isWorking) return;

        if (activity.requiredItem && !inventory.includes(activity.requiredItem)) {
            setStatusMessage(`Kamu perlu memiliki item "${activity.requiredItem}" untuk melakukan aktivitas ini.`);
            statusTimeoutRef.current = setTimeout(() => {
                setStatusMessage('');
                statusTimeoutRef.current = null;
            }, 3000);
            return;
        }

        setCurrentActivity(activity);
        setShowActivityMenu(false);
        setIsWorking(true);
        setProgress(0);
        setProgressColor(nearPoint.color);
        setStatusMessage(`Sedang ${activity.name}...`);
        setActivityHistory(prev => [...prev, activity.name]);
        setVisitedLocations(prev => new Set(prev).add(nearPoint.name));


        displayActivityAnimation(activity);

        if (mode === 'fast') {
            // Fast mode - complete instantly
            setProgress(100);

            // Apply stats immediately with visual feedback
            applyStats(activity.stat);

            // Special fast completion animation
            setAnimationData({
                icon: '⚡',
                name: `${activity.name} (Clear!)`
            });

            setTimeout(() => {
                finishActivity(`${activity.name} selesai Clear!`, activity);
                setAnimationData(null);
            }, 800);
        } else {
            // Normal mode - progress over time
            const duration = activity.duration;
            const stepTime = 200;
            const steps = Math.floor(duration / stepTime);
            const perStep = {};

            for (const key in activity.stat) {
                perStep[key] = activity.stat[key] / steps;
            }

            let count = 0;
            intervalRef.current = setInterval(() => {
                count++;
                setStats(prev => {
                    const updated = { ...prev };
                    for (const key in perStep) {
                        updated[key] = Math.max(0, +(updated[key] + perStep[key]).toFixed(2));
                    }
                    return updated;
                });
                setProgress((count / steps) * 100);

                if (count >= steps) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    finishActivity(`${activity.name} selesai!`, activity);
                }
            }, stepTime);
        }
    }

    // Tambahan fungsi di dalam komponen Game()
    function triggerInstantActivities() {
        let messageLog = [];
        let allActivities = [];

        points.forEach(point => {
            point.activities.forEach(activity => {
                if (activity.requiredItem && !inventory.includes(activity.requiredItem)) {
                    messageLog.push(`❌ Lewati ${activity.name} (butuh ${activity.requiredItem})`);
                    return;
                }

                // Simpan untuk animasi batch
                allActivities.push({ point, activity });

                applyStats(activity.stat);

                if (activity.item) {
                    setInventory(prev => [...prev, activity.item]);
                    messageLog.push(`🎁 Dapat item: ${activity.item}`);
                }

                messageLog.push(`✔️ ${activity.name} di ${point.name}`);
            });
        });

        // Tampilkan ringkasan status
        setStatusMessage(`⚡ Semua aktivitas selesai secara instan!`);
        statusTimeoutRef.current = setTimeout(() => {
            setStatusMessage('');
            statusTimeoutRef.current = null;
        }, 5000);

        // Animasi batch (petir & nama aktivitas cepat)
        let i = 0;
        const showNextAnimation = () => {
            if (i >= allActivities.length) return;

            const { activity, point } = allActivities[i];
            setAnimationData({
                icon: '⚡',
                name: `${activity.name} (${point.name})`
            });
            setShowActivityAnimationModal(true);

            setTimeout(() => {
                setShowActivityAnimationModal(false);
                setAnimationData(null);
                i++;
                setTimeout(showNextAnimation, 300); // jeda antar animasi
            }, 500);
        };

        showNextAnimation();

        // Tampilkan notifikasi kecil
        messageLog.forEach((msg, idx) => {
            setTimeout(() => {
                showStatNotification(msg);
            }, 200 * idx);
        });
    }

    // Pada tombol mode percepatan, ganti handler menjadi:
    <button
        onClick={() => {
            setMode('fast');
            triggerInstantActivities();
        }}
        className={mode === 'fast' ? 'active-mode' : ''}
    >
        {mode === 'fast' ? '⚡ Mode Percepatan (AKTIF)' : '⚡ Mode Percepatan'}
    </button>

    function handleUseItem(item) {
        let effectMessage = '';

        if (item === 'Roti') {
            applyStats({ food: 5 });
            setUsedItems(prev => [...prev, item]);
            effectMessage = 'Kamu makan Roti. 🍞 Makanan +5';
        } else if (item === 'Sapu') {
            applyStats({ clean: 10 });
            setUsedItems(prev => [...prev, item]); // ⬅️ tambahkan ini
            effectMessage = 'Kamu menggunakan Sapu. 🧼 Kebersihan +10';
        } else if (item === 'Kamera') {
            effectMessage = 'Kamera tidak bisa digunakan langsung.';
        }

        if (item !== 'Kamera') {
            setInventory(prev => {
                const index = prev.indexOf(item);
                if (index > -1) {
                    const newInv = [...prev];
                    newInv.splice(index, 1);
                    return newInv;
                }
                return prev;
            });
        }

        setStatusMessage(effectMessage);
        statusTimeoutRef.current = setTimeout(() => {
            setStatusMessage('');
            statusTimeoutRef.current = null;
        }, 3000);
    }

    function buyItem(item) {
        if (stats.coin < item.cost) {
            setStatusMessage('Koin kamu tidak cukup untuk membeli item ini.');
            statusTimeoutRef.current = setTimeout(() => {
                setStatusMessage('');
                statusTimeoutRef.current = null;
            }, 3000);
            return;
        }
        setStats(prev => ({ ...prev, coin: prev.coin - item.cost }));
        setInventory(prev => [...prev, item.name]);
        setStatusMessage(`Kamu membeli item: ${item.name} (-💰 ${item.cost})`);
        statusTimeoutRef.current = setTimeout(() => {
            setStatusMessage('');
            statusTimeoutRef.current = null;
        }, 3000);
    }

    if (showSplash) {
        return <PixelSplashScreen onComplete={() => {
            setShowSplash(false);
            setTimeout(() => {
                setGameStarted(true);
                setIsMusicPlaying(true);
            }, 1000);
        }} />;
    }

    if (!gameStarted) return null;

    return (
        <div className="sulawesi-container">
            <div className="top-right-controls">
                <button className="sulawesi-back-button" onClick={() => navigate(-1)}>
                    ← Kembali
                </button>
                <div className="timer-display">
                    ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            </div>

            <div className="sidebar-ui">
                <div className="player-info">
                    <h3>👤 {playerName}</h3>
                </div>
                <div className="mode-buttons">
                    <button
                        onClick={() => setMode('normal')}
                        className={mode === 'normal' ? 'active-mode' : ''}
                    >
                        {mode === 'normal' ? '✨ Mode Normal (AKTIF)' : '✨ Mode Normal'}
                    </button>
                    <button
                        onClick={() => {
                            setMode('fast');
                            triggerInstantActivities();
                        }}
                        className={mode === 'fast' ? 'active-mode' : ''}
                    >
                        {mode === 'fast' ? '⚡ Mode Percepatan (AKTIF)' : '⚡ Mode Percepatan'}
                    </button>
                </div>

                <div className="stats-panel">
                    <h3>Statistik Pemain:</h3>
                    <ul className="stats-list">
                        <li>🍞 Makanan: {stats.food.toFixed(1)}</li>
                        <li>😊 Kebahagiaan: {stats.happiness.toFixed(1)}</li>
                        <li>⚡ Energi: {stats.energy.toFixed(1)}</li>
                        <li>📘 Pengetahuan: {stats.knowledge.toFixed(1)}</li>
                        <li>🧼 Kebersihan: {stats.clean.toFixed(1)}</li>
                        <li>💰 Coin: {stats.coin}</li>
                    </ul>
                </div>

                <div className="life-score-panel">
                    <h3>🌈 Life Satisfaction</h3>
                    <p className="score-value">{lifeScore}</p>
                </div>


                <button className="shop-button" onClick={() => setShowShop(true)}>
                    🛒 Buka Toko
                </button>

                <button className="rules-button" onClick={() => setShowRules(true)}>
                    📋 Aturan Game
                </button>

                <button className="dpad-toggle" onClick={() => setShowDPad(!showDPad)}>
                    {showDPad ? '▲ Sembunyikan D-Pad' : '▼ Tampilkan D-Pad'}
                </button>

                <div className="music-controls">
                    <div className="music-toggle">
                        <button onClick={toggleMusic}>
                            {isMusicPlaying ? '🔊 ' : '🔈 '}
                        </button>
                    </div>
                    <div className="volume-control">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={musicVolume}
                            onChange={handleVolumeChange}
                        />
                        <span>Volume: {Math.round(musicVolume * 100)}%</span>
                    </div>
                </div>
            </div>

            <div className="inventory-toggle" onClick={() => setIsInventoryOpen(!isInventoryOpen)}>
                {isInventoryOpen ? '▲ Tutup Inventory' : '▼ Buka Inventory'}
            </div>

            {isInventoryOpen && (
                <div className="modal-overlay" onClick={() => setIsInventoryOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Inventory Kamu</h3>
                        {inventory.length === 0 ? (
                            <p className="empty-inventory">(Inventory kosong)</p>
                        ) : (
                            <ul className="inventory-list">
                                {inventory.map((item, idx) => (
                                    <li key={idx} className="inventory-item">
                                        <span>{item}</span>
                                        <button
                                            className="use-item-button"
                                            onClick={() => handleUseItem(item)}
                                        >
                                            Gunakan
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button className="close-button" onClick={() => setIsInventoryOpen(false)}>
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {showShop && (
                <div className="modal-overlay" onClick={() => setShowShop(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Toko</h3>
                        <ul className="shop-list">
                            {shopItems.map((item, idx) => (
                                <li key={idx} className="shop-item">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">💰 {item.cost}</span>
                                    <button
                                        className="buy-button"
                                        onClick={() => buyItem(item)}
                                        disabled={stats.coin < item.cost || isWorking}
                                    >
                                        Beli
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="close-button" onClick={() => setShowShop(false)}>
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {showRules && (
                <div className="modal-overlay" onClick={() => setShowRules(false)}>
                    <div className="rules-content" onClick={e => e.stopPropagation()}>
                        <h2>📋 Aturan Game - Petualangan Sulawesi</h2>
                        <div className="rules-section">
                            <h3>
                                <div className="rules-icon">🎮</div>
                                <span>Cara Bermain</span>
                            </h3>
                            <div className="rules-text">
                                <ul className="rules-list">
                                    <li>Gunakan tombol panah (↑↓←→) atau WASD untuk menggerakkan karakter</li>
                                    <li>Gunakan D-pad di layar untuk mobile/touch</li>
                                    <li>Mendekati lokasi (Taman, Museum, Pantai) untuk melakukan aktivitas</li>
                                    <li>Klik pada lokasi atau tekan tombol saat dekat untuk membuka menu aktivitas</li>
                                </ul>
                            </div>
                        </div>
                        <div className="rules-section">
                            <h3>
                                <div className="rules-icon">⚡</div>
                                <span>Mode Percepatan</span>
                            </h3>
                            <div className="rules-text">
                                <p>Mode percepatan memungkinkan kamu menyelesaikan aktivitas secara instan!</p>
                                <ul className="rules-list">
                                    <li>Aktivitas akan selesai seketika dengan animasi kilat</li>
                                    <li>Semua efek statistik tetap berlaku</li>
                                    <li>Berguna ketika kamu ingin cepat menyelesaikan banyak aktivitas</li>
                                </ul>
                            </div>
                        </div>
                        <button className="rules-close-button" onClick={() => setShowRules(false)}>
                            Tutup Aturan
                        </button>
                    </div>
                </div>
            )}

            <div className="game-world">
                <img
                    src={getAvatarImage()}
                    alt="Avatar"
                    className={`avatar ${isMoving ? 'moving' : ''} ${isWorking ? 'working' : ''}`}
                    style={{
                        left: `${avatarPos.x}px`,
                        top: `${avatarPos.y}px`,
                    }}
                    onError={(e) => {
                        e.target.src = playerDiam;
                    }}
                />

                {isWorking && (
                    <div
                        className="activity-progress-bar"
                        style={{
                            left: `${avatarPos.x - 15}px`,
                            top: `${avatarPos.y - 30}px`
                        }}
                    >
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: progressColor
                            }}
                        ></div>
                    </div>
                )}

                {points.map(p => (
                    <div
                        key={p.id}
                        className={`location-point ${nearPoint?.id === p.id ? 'active' : ''}`}
                        style={{
                            left: `${p.x}px`,
                            top: `${p.y}px`,
                            backgroundColor: p.color
                        }}
                        title={p.name}
                    >
                        {p.activities[0].icon}
                    </div>
                ))}
            </div>

            {showDPad && (
                <div className="d-pad-container">
                    <div className="d-pad">
                        <button
                            className={getDPadButtonClass('up')}
                            data-direction="up"
                            onTouchStart={() => handleDPadPress('up')}
                            onTouchEnd={() => handleDPadRelease('up')}
                            onMouseDown={() => handleDPadPress('up')}
                            onMouseUp={() => handleDPadRelease('up')}
                            onMouseLeave={() => handleDPadRelease('up')}
                        >
                            ↑
                        </button>
                        <div className="d-pad-row">
                            <button
                                className={getDPadButtonClass('left')}
                                data-direction="left"
                                onTouchStart={() => handleDPadPress('left')}
                                onTouchEnd={() => handleDPadRelease('left')}
                                onMouseDown={() => handleDPadPress('left')}
                                onMouseUp={() => handleDPadRelease('left')}
                                onMouseLeave={() => handleDPadRelease('left')}
                            >
                                ←
                            </button>
                            <div className="d-pad-center"></div>
                            <button
                                className={getDPadButtonClass('right')}
                                data-direction="right"
                                onTouchStart={() => handleDPadPress('right')}
                                onTouchEnd={() => handleDPadRelease('right')}
                                onMouseDown={() => handleDPadPress('right')}
                                onMouseUp={() => handleDPadRelease('right')}
                                onMouseLeave={() => handleDPadRelease('right')}
                            >
                                →
                            </button>
                        </div>
                        <button
                            className={getDPadButtonClass('down')}
                            data-direction="down"
                            onTouchStart={() => handleDPadPress('down')}
                            onTouchEnd={() => handleDPadRelease('down')}
                            onMouseDown={() => handleDPadPress('down')}
                            onMouseUp={() => handleDPadRelease('down')}
                            onMouseLeave={() => handleDPadRelease('down')}
                        >
                            ↓
                        </button>
                    </div>
                </div>
            )}

            {showActivityMenu && nearPoint && (
                <div className="location-activity-menu">
                    <h3>Aktivitas di {nearPoint.name}</h3>
                    <div className="location-activities">
                        {nearPoint.activities.map((activity, index) => (
                            <button
                                key={index}
                                className="location-activity-button"
                                onClick={() => startActivity(activity)}
                                disabled={isWorking || (activity.requiredItem && !inventory.includes(activity.requiredItem))}
                                title={activity.requiredItem ? `Butuh item: ${activity.requiredItem}` : ''}
                            >
                                <span className="location-activity-icon">{activity.icon}</span>
                                <div className="location-activity-name">{activity.name}</div>
                                <div className="location-activity-effect">
                                    {Object.entries(activity.stat).map(([key, value]) => {
                                        const statIcons = {
                                            food: '🍞',
                                            energy: '⚡',
                                            clean: '🧼',
                                            happiness: '😊',
                                            knowledge: '📘'
                                        };
                                        return `${statIcons[key] || ''} ${value > 0 ? '+' : ''}${value}`;
                                    }).join(' ')}
                                </div>
                            </button>
                        ))}
                    </div>
                    <button
                        className="close-button"
                        onClick={() => {
                            setShowActivityMenu(false);
                            setActivityJustClosed(true);

                            setTimeout(() => {
                                setActivityJustClosed(false);
                            }, 1000); // tunggu sebentar sebelum bisa auto muncul lagi
                        }}
                    >
                        Tutup
                    </button>
                </div>
            )}

            {showItemChoice && currentItemChoice && (
                <div className="item-choice-modal">
                    <div className="item-choice-content">
                        <h3>Item Ditemukan!</h3>
                        <div className="item-description">
                            Kamu menemukan <strong>{currentItemChoice.item}</strong>.
                            Apa yang ingin kamu lakukan?
                        </div>
                        <div className="item-choices">
                            <button
                                className="item-choice-button save-option"
                                onClick={() => handleItemChoice('save', currentItemChoice.item)}
                            >
                                <span className="choice-icon">💼</span>
                                <span>Simpan ke Inventory</span>
                            </button>
                            <button
                                className="item-choice-button use-option"
                                onClick={() => handleItemChoice('use', currentItemChoice.item)}
                            >
                                <span className="choice-icon">✨</span>
                                <span>Gunakan Langsung</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showActivityAnimationModal && animationData && (
                <div className="activity-animation-overlay">
                    <div className="activity-animation">
                        {animationData.icon}
                        {mode === 'fast' && (
                            <div className="fast-mode-badge">⚡ Clear!</div>
                        )}
                    </div>
                    <div className="activity-text">{animationData.name}</div>
                    <div className="activity-progress">
                        <div
                            className="activity-progress-fill"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: mode === 'fast' ? '#ffeb3b' : progressColor
                            }}
                        ></div>
                    </div>
                </div>
            )}

            {statNotifications.map(notification => (
                <div key={notification.id} className="stat-change-notification">
                    {notification.message}
                </div>
            ))}

            {statusMessage && (
                <div className="status-message">
                    {statusMessage}
                </div>
            )}

            {isGameOver && (
                <div className="game-over-overlay">
                    <img src={require('./Aset Images/playerdead.gif')} alt="Game Over" className="game-over-gif" />
                    <div className="game-over-text">💀 Waktu Habis! Game Over!</div>
                    <div className="final-score">
                        <p>🌈 Life Satisfaction: <strong>{lifeScore}</strong></p>
                        <p>🎯 Skor Akhir: <strong>{lifeScore}</strong></p>
                    </div>
                    <button className="restart-button" onClick={() => window.location.reload()}>
                        🔄 Coba Lagi
                    </button>
                </div>
            )}
        </div>
    );
}

export default Game;