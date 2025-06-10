import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";

// Import your assets
import cloudImg from "../src/Aset Images/AsetCloudCover.png";
import islandImg from "../src/Aset Images/AsetPulauCover.png";
import bgMusic from "../src/Aset Images/audio/jawa.mp3";

function CoverGame() {
  const audioRef = useRef(null);
  const textRef = useRef(null);

  // Music control functions
  const playAudio = () => {
    audioRef.current.play();
  };

  const pauseAudio = () => {
    audioRef.current.pause();
  };

  const increaseVolume = () => {
    if (audioRef.current.volume < 1) {
      audioRef.current.volume += 0.1;
    }
  };

  const decreaseVolume = () => {
    if (audioRef.current.volume > 0) {
      audioRef.current.volume -= 0.1;
    }
  };

  // Text animation
  useEffect(() => {
    const textElement = textRef.current;
    const texts = ["Apa Kabar?", "Piye Kabare?", "Ise Kabar Taka?"];
    let currentIndex = 0;

    const animateText = () => {
      textElement.style.opacity = 0;
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        textElement.textContent = texts[currentIndex];
        textElement.style.opacity = 1;
      }, 500);
    };

    const interval = setInterval(animateText, 3000);
    return () => clearInterval(interval);
  }, []);

  // Autoplay after user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  return (
    <div className="cover-container">
      {/* Clouds */}
      <div className="cloud-container">
        <img src={cloudImg} className="clouds" alt="Clouds" />
      </div>

      {/* Header with integrated music controls */}
      <header className="cover-header">
        <div className="logo">
          <h1>MIZEYA</h1>
        </div>
        <div className="music-controls">
          <audio ref={audioRef} loop>
            <source src={bgMusic} type="audio/mpeg" />
            Browser Anda tidak mendukung elemen audio.
          </audio>
          <button className="music-btn" onClick={playAudio}>▶</button>
          <button className="music-btn" onClick={pauseAudio}>⏸</button>
          <button className="music-btn" onClick={increaseVolume}>🔊</button>
          <button className="music-btn" onClick={decreaseVolume}>🔉</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="cover-content">
        <div className="banner">
          <img src={islandImg} alt="Pulau Mizeya" className="island-img" />
          <h1 className="greeting">Hallo Semua! <span ref={textRef}>Petualang!</span></h1>
          <h1 className="welcome">SELAMAT DATANG DI MIZEYA</h1>
          <h2 className="cta">SIAP UNTUK BERPETUALANG?!</h2>

          <div className="button-group">
    <Link to="/game" className="btn-link">
        <button className="btn-primary">Mulai Sekarang</button>
    </Link>
    <Link to="/login" className="btn-link">
        <button className="btn-primary">Log In</button>
    </Link>
    <Link to="/setting" className="btn-link">
        <button className="btn-primary">Pengaturan</button>
    </Link>
    <Link to="/portfolio" className="btn-link">
        <button className="btn-primary">Tentang Kami</button>
    </Link>
</div>
        </div>
      </main>
    </div>
  );
}

export default CoverGame;