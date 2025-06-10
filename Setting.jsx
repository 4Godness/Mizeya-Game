import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const GameSettings = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [language, setLanguage] = useState('id');
  const [difficulty, setDifficulty] = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Gagal memutar musik:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const saveSettings = () => {
    alert("Pengaturan disimpan!");
  };

  const navigate = useNavigate();

  return (
    <div className="setting-page">
      <div className="setting-box">
        <div className="setting-header">
          <h1>Game Settings</h1>
          <div className="setting-decoration top-left"></div>
          <div className="setting-decoration top-right"></div>
          <div className="setting-decoration bottom-left"></div>
          <div className="setting-decoration bottom-right"></div>
        </div>

        <div className="setting-content">
          <div className="setting-group">
            <label htmlFor="language">
              <span className="setting-icon">🌐</span> Language
            </label>
            <select 
              id="language" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="setting-select"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
              <option value="jp">日本語</option>
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="difficulty">
              <span className="setting-icon">⚔️</span> Difficulty
            </label>
            <select 
              id="difficulty" 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="setting-select"
            >
              <option value="easy">Easy (Pemula)</option>
              <option value="medium">Medium (Petualang)</option>
              <option value="hard">Hard (Kesatria)</option>
            </select>
          </div>

          <div className="setting-group setting-toggle">
            <label htmlFor="sound">
              <span className="setting-icon">🔊</span> Sound Effects
            </label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="sound" 
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span className="slider"></span>
            </div>
          </div>

          <div className="setting-group">
            <label>
              <span className="setting-icon">🎵</span> Music Volume
            </label>
            <div className="volume-control">
              <button className="volume-btn" onClick={() => setVolume(Math.max(0, volume - 10))}>-</button>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="volume-slider"
              />
              <button className="volume-btn" onClick={() => setVolume(Math.min(100, volume + 10))}>+</button>
              <span className="volume-value">{volume}%</span>
            </div>
          </div>
        </div>

        <div className="setting-buttons">
          <button className="setting-btn save-btn" onClick={saveSettings}>
            <span className="btn-icon">💾</span> Save Settings
          </button>
          <button className="setting-btn back-btn" onClick={() => navigate(-1)}>
            <span className="btn-icon">←</span> Back to Game
          </button>
        </div>
      </div>

      <audio ref={audioRef} loop src="/path/to/your/game-music.mp3" />
    </div>
  );
};

export default GameSettings;