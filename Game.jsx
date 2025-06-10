import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Game.css';
import bgMusic from "../src/Aset Images/audio/GameMusik.mp3";

const MOVE_SPEED = 0.5;
const MOVE_INTERVAL = 16;

const initialStats = {
  food: 100,
  sleep: 100,
  hygiene: 100,
  happiness: 100,
  money: 10000,
};

const initialInventory = [
  { id: 'apple', name: '🍎 Apel', effect: { food: +10 }, quantity: 3 },
  { id: 'coffee', name: '☕ Kopi', effect: { happiness: +5, sleep: -10 }, quantity: 2 },
  { id: 'soap', name: '🧼 Sabun', effect: { hygiene: +20 }, quantity: 1 },
];

const activities = [
  { id: 'eat', name: 'Makan', effect: { food: +20, happiness: +5 }, requiredItemId: 'apple' },
  { id: 'sleep', name: 'Tidur', effect: { sleep: +40, food: -10 } },
  { id: 'shower', name: 'Mandi', effect: { hygiene: +50, happiness: +10 }, requiredItemId: 'soap' },
  { id: 'work', name: 'Bekerja', effect: { money: +1000, happiness: -10, sleep: -20 } },
];

const mapPoints = [
  { id: 'jawa', x: 61, y: 70, path: '/jawa' },
  { id: 'sumatera', x: 23, y: 51, path: '/sumatera' },
  { id: 'kalimantan', x: 36, y: 12, path: '/kalimantan' },
  { id: 'sulawesi', x: 58, y: 12, path: '/Sulawesi' },
  { id: 'maluku', x: 77, y: 40, path: '/Maluku' },
];

const getGreeting = (hour) => {
  if (hour >= 5 && hour < 11) return 'Selamat pagi ☀️';
  if (hour >= 11 && hour < 15) return 'Selamat siang 🌤️';
  if (hour >= 15 && hour < 18) return 'Selamat sore 🌇';
  return 'Selamat malam 🌙';
};

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVehicle = location.state?.selectedVehicle;
  const playerName = location.state?.playerName || localStorage.getItem('gameUsername') || 'Player';

  const [gameTime, setGameTime] = useState(420);
  const [playerStats, setPlayerStats] = useState(initialStats);
  const [inventory, setInventory] = useState(initialInventory);
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [playerRotation, setPlayerRotation] = useState(0);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const audioRef = useRef(null);
  const [musicVolume, setMusicVolume] = useState(0.5); // default 50%

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime((time) => (time + 1) % (24 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFirstInteraction = () => {
      audioRef.current?.play().catch(err => console.log("Autoplay error:", err));
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);
  

  const checkIfOnMapPoint = () => {
    const threshold = 3;
    for (let point of mapPoints) {
      const dx = Math.abs(playerPosition.x - point.x);
      const dy = Math.abs(playerPosition.y - point.y);
      if (dx <= threshold && dy <= threshold) {
        navigate(point.path, {
          state: {
            fromMap: true,
            playerName, // 
          }
        });
        break;
      }
    }
  };
  const handleDPadPress = (direction) => {
    const keyMap = {
      'arrowup': 'w',
      'arrowdown': 's',
      'arrowleft': 'a',
      'arrowright': 'd'
    };

    setActiveKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.add(direction);
      newKeys.add(keyMap[direction]);
      return newKeys;
    });

    const rotationMap = {
      'arrowup': 0,
      'arrowright': 90,
      'arrowdown': 180,
      'arrowleft': 270
    };
    setPlayerRotation(rotationMap[direction]);

    setTimeout(() => {
      setActiveKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(direction);
        newKeys.delete(keyMap[direction]);
        return newKeys;
      });
    }, MOVE_INTERVAL * 2);
  };
  
  useEffect(() => {
    if (!location.state || !location.state.playerName) {
      alert("Silakan login dan pilih avatar terlebih dahulu.");
      navigate('/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    const storedPlayerName = localStorage.getItem('gamePlayerName');
    if (!location.state?.playerName && !storedPlayerName) {
      alert("Silakan login dan pilih avatar terlebih dahulu.");
      navigate('/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Simpan state penting ke localStorage
    if (playerName) {
      localStorage.setItem('gamePlayerName', playerName);
    }
    if (selectedVehicle) {
      localStorage.setItem('gameSelectedVehicle', JSON.stringify(selectedVehicle));
    }
  }, [playerName, selectedVehicle]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        setActiveKeys((keys) => new Set(keys).add(key));
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      setActiveKeys((keys) => {
        const newKeys = new Set(keys);
        newKeys.delete(key);
        return newKeys;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPlayerPosition((pos) => {
        let newX = pos.x;
        let newY = pos.y;
        if (activeKeys.has('arrowup') || activeKeys.has('w')) newY = Math.max(0, pos.y - MOVE_SPEED);
        if (activeKeys.has('arrowdown') || activeKeys.has('s')) newY = Math.min(100, pos.y + MOVE_SPEED);
        if (activeKeys.has('arrowleft') || activeKeys.has('a')) newX = Math.max(0, pos.x - MOVE_SPEED);
        if (activeKeys.has('arrowright') || activeKeys.has('d')) newX = Math.min(100, pos.x + MOVE_SPEED);
        return { x: newX, y: newY };
      });
      checkIfOnMapPoint();
    }, MOVE_INTERVAL);
    return () => clearInterval(moveInterval);
  }, [activeKeys, playerPosition]);

  const useItem = (itemId) => {
    const itemIndex = inventory.findIndex((i) => i.id === itemId);
    if (itemIndex === -1 || inventory[itemIndex].quantity <= 0) {
      setMessage('Item tidak tersedia!');
      return;
    }
    const item = inventory[itemIndex];
    applyEffect(item.effect);
    setInventory((inv) => {
      const newInv = [...inv];
      newInv[itemIndex] = { ...item, quantity: item.quantity - 1 };
      return newInv;
    });
    setMessage(`Kamu menggunakan ${item.name}`);
  };

  const doActivity = (activity) => {
    if (activity.requiredItemId) {
      const item = inventory.find((i) => i.id === activity.requiredItemId && i.quantity > 0);
      if (!item) {
        setMessage(`Butuh item "${activity.requiredItemId}" untuk melakukan aktivitas ini!`);
        return;
      }
      useItem(activity.requiredItemId);
    } else {
      setMessage(`Melakukan aktivitas: ${activity.name}`);
    }
    applyEffect(activity.effect);
  };

  const applyEffect = (effect) => {
    setPlayerStats((stats) => {
      const newStats = { ...stats };
      Object.entries(effect).forEach(([key, val]) => {
        if (key === 'money') {
          newStats.money = Math.max(0, newStats.money + val);
        } else {
          newStats[key] = clamp((newStats[key] ?? 0) + val);
        }
      });
      return newStats;
    });
  };

  const formatTime = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`game-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Musik BGM */}
      <audio ref={audioRef} loop>
        <source src={bgMusic} type="audio/mpeg" />
        Browser Anda tidak mendukung audio.
      </audio>

      {showInventory && (
        <div className="inventory-modal-overlay" onClick={() => setShowInventory(false)}>
          <div className="inventory-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="inventory-modal-header">
              <h2>Inventory</h2>
              <button className="inventory-close-btn" onClick={() => setShowInventory(false)}>×</button>
            </div>
            <div className="inventory-modal-body">
              {inventory.length === 0 ? <p>Tidak ada item</p> : inventory.map(({ id, name, quantity }) =>
                quantity > 0 && (
                  <div key={id} className="inventory-item">
                    <span className="inventory-item-name">{name}</span>
                    <span className="inventory-item-quantity">x{quantity}</span>
                    <button className="inventory-use-btn" onClick={() => useItem(id)}>Pakai</button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <div className="game-wrapper">
        <header className="game-header">
          <button className="back-btn" onClick={() => navigate('/')}>← Kembali</button>

          <div className="game-header-center">
            <h1 className="game-header-title">{getGreeting(Math.floor(gameTime / 60))}</h1>
            <div className="game-header-time">{formatTime(gameTime)}</div>
          </div>

          <div className="game-header-right">
            <div className="player-name-display">
              👤 {playerName}
            </div>

            {/* Volume Slider */}
            <div className="volume-control">
              🔊
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                style={{ verticalAlign: 'middle', marginLeft: '5px' }}
              />
            </div>

            <button className="dark-mode-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>
        <div className="game-content">
          <div className="map-overlay">
            {mapPoints.map((point) => (
              <div key={point.id} className="map-point" style={{ top: `${point.y}%`, left: `${point.x}%`, pointerEvents: 'none' }}>🔘</div>
            ))}

            {selectedVehicle && (
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                className="player-vehicle"
                style={{
                  position: 'absolute',
                  left: `${playerPosition.x}%`,
                  top: `${playerPosition.y}%`,
                  transform: `translate(-50%, -50%) rotate(${playerRotation}deg)`,
                  transition: 'left 0.2s ease-out, top 0.2s ease-out, transform 0.3s ease-out',
                  width: '40px',
                  height: '40px',
                }}
              />
            )}
          </div>

          <div className="game-status-panel">
            <section className="game-panel-mini">
              <h3 className="game-panel-mini-title">Status</h3>
              {Object.entries(playerStats).map(([key, val]) => (
                <div key={key} className="game-status-mini">
                  <span className="status-mini-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <div className="status-mini-bar">
                    <div className="status-mini-fill" style={{
                      width: key === 'money' ? '100%' : `${val}%`, backgroundColor:
                        key === 'food' ? '#f87171' :
                          key === 'sleep' ? '#60a5fa' :
                            key === 'hygiene' ? '#34d399' :
                              key === 'happiness' ? '#fbbf24' : '#a78bfa'
                    }} />
                  </div>
                  <span className="status-mini-value">{val}{key === 'money' ? '' : '%'}</span>
                </div>
              ))}
            </section>
          </div>

          <div className="game-controls-panel">
            <div className="d-pad-container">
              <button
                onClick={() => handleDPadPress('arrowup')}
                className={`d-pad-btn up ${activeKeys.has('arrowup') || activeKeys.has('w') ? 'active' : ''}`}
              >
                ↑
              </button>
              <div className="d-pad-middle">
                <button
                  onClick={() => handleDPadPress('arrowleft')}
                  className={`d-pad-btn left ${activeKeys.has('arrowleft') || activeKeys.has('a') ? 'active' : ''}`}
                >
                  ←
                </button>
                <div className="d-pad-center">+</div>
                <button
                  onClick={() => handleDPadPress('arrowright')}
                  className={`d-pad-btn right ${activeKeys.has('arrowright') || activeKeys.has('d') ? 'active' : ''}`}
                >
                  →
                </button>
              </div>
              <button
                onClick={() => handleDPadPress('arrowdown')}
                className={`d-pad-btn down ${activeKeys.has('arrowdown') || activeKeys.has('s') ? 'active' : ''}`}
              >
                ↓
              </button>
            </div>
          </div>

          <div className="game-bottom-bar">
            <button className="inventory-btn" onClick={() => setShowInventory(true)}>🎒 Inventory</button>
            <div className="activities-bar">
              {activities.map((act) => (
                <button key={act.id} className="activity-btn" onClick={() => doActivity(act)} title={act.name}>
                  {act.name === 'Makan' ? '🍽️' : act.name === 'Tidur' ? '😴' : act.name === 'Mandi' ? '🚿' : act.name === 'Bekerja' ? '💼' : act.name}
                </button>
              ))}
            </div>
            {message && <div className="game-message"><p>{message}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}