import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Import vehicle images
import kapalImg from './Aset Images/kapal.png';
import mobilImg from './Aset Images/mobil.png';
import pesawatImg from './Aset Images/pesawat.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Available vehicles with descriptions and corresponding avatars
  const vehicles = [
    {
      id: 1,
      name: 'Kapal',
      image: kapalImg,
      description: 'Jelajahi lautan Nusantara',
      speed: 'Sedang',
      terrain: 'Laut',
      avatar: '🚢'
    },
    {
      id: 2,
      name: 'Mobil',
      image: mobilImg,
      description: 'Petualangan darat yang seru',
      speed: 'Cepat',
      terrain: 'Darat',
      avatar: '🚗'
    },
    {
      id: 3,
      name: 'Pesawat',
      image: pesawatImg,
      description: 'Terbang tinggi menjelajahi pulau',
      speed: 'Sangat Cepat',
      terrain: 'Udara',
      avatar: '✈️'
    }
  ];

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const enableAudio = () => {
    if (audioEnabled) return;
    setAudioEnabled(true);

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Audio error:", error);
      });
    }
  };

  const handlePrevVehicle = () => {
    enableAudio();
    setCurrentVehicleIndex(prev => (prev - 1 + vehicles.length) % vehicles.length);
  };

  const handleNextVehicle = () => {
    enableAudio();
    setCurrentVehicleIndex(prev => (prev + 1) % vehicles.length);
  };

  const handleMusicToggle = () => {
    enableAudio();

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(error => {
        console.error("Audio error:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleStartGame = () => {
    enableAudio();

    if (!username.trim()) {
      setErrorMessage('Mohon masukkan nama terlebih dahulu!');
      return;
    }

    if (username.trim().length < 3 || username.trim().length > 20) {
      setErrorMessage('Nama harus antara 3-20 karakter!');
      return;
    }

    setErrorMessage('');

    const selectedVehicle = vehicles[currentVehicleIndex];
    const selectedAvatar = selectedVehicle.avatar;

    // Save to localStorage as backup
    localStorage.setItem('gameUsername', username.trim());
    localStorage.setItem('selectedVehicle', JSON.stringify(selectedVehicle));
    localStorage.setItem('selectedAvatar', selectedAvatar);

    // Navigate with state
    navigate('/game', {
      state: {
        playerName: username.trim(),  // Changed from username to playerName for consistency
        selectedVehicle: selectedVehicle,
        selectedAvatar: selectedAvatar
      }
    });
  };

  const handleBackToCover = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    }
    navigate('/');
  };

  return (
    <div className="login-screen">
      {/* Background elements */}
      <div className="ocean-bg"></div>
      <div className="island-bg"></div>

      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src="./Aset Images/audio/background-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Main Content */}
      <div className="login-container">
        {/* Back Button */}
        <button
          onClick={handleBackToCover}
          className="back-button"
          aria-label="Kembali ke halaman cover"
        >
          Kembali
        </button>

        {/* Music Toggle */}
        <button
          onClick={handleMusicToggle}
          className={`music-toggle ${isPlaying ? 'playing' : ''}`}
          aria-label={isPlaying ? 'Mute music' : 'Unmute music'}
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>

        <h1 className="game-title">MIZEYA ADVENTURE</h1>

        {/* Username Input */}
        <div className="input-group">
          <label htmlFor="username">Nama Petualang:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrorMessage('');
            }}
            placeholder="Masukkan nama anda (3-20 karakter)"
            maxLength={20}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        {/* Vehicle Selection */}
        <div className="vehicle-selection">
          <h2>Pilih Kendaraan:</h2>

          <div className="vehicle-slider">
            <button onClick={handlePrevVehicle} className="nav-button prev">
              ‹
            </button>

            <div className="vehicle-display">
              <img
                src={vehicles[currentVehicleIndex].image}
                alt={vehicles[currentVehicleIndex].name}
                className="vehicle-image"
              />
              <div className="vehicle-info">
                <h3>{vehicles[currentVehicleIndex].name}</h3>
                <p>{vehicles[currentVehicleIndex].description}</p>
                <div className="vehicle-stats">
                  <span>Kecepatan: {vehicles[currentVehicleIndex].speed}</span>
                  <span>Medan: {vehicles[currentVehicleIndex].terrain}</span>
                </div>
                <div className="avatar-preview">
                  <span>Avatar: {vehicles[currentVehicleIndex].avatar}</span>
                </div>
              </div>
            </div>

            <button onClick={handleNextVehicle} className="nav-button next">
              ›
            </button>
          </div>

          <div className="vehicle-dots">
            {vehicles.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentVehicleIndex ? 'active' : ''}`}
                onClick={() => setCurrentVehicleIndex(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="start-button-container">
          <button
            onClick={handleStartGame}
            className="start-button"
            disabled={!username.trim()}
          >
            MULAI PETUALANGAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;