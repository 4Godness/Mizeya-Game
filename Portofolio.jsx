import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import music from "../src/Aset Images/audio/jawa.mp3";
import './style.css'; // File CSS terpisah untuk portfolio

const Portofolio = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [enlargedBox, setEnlargedBox] = useState(null);
    const audioRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const toggleMusic = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleBoxClick = (index) => {
        setEnlargedBox(enlargedBox === index ? null : index);
    };

    const handleBack = () => {
        navigate('/covergame');
    };

    const handleBackToCover = () => {
        if (isPlaying) {
            audioRef.current.pause();
        }
        navigate('/');
    };

    const gameInfoData = [
        {
            title: "Tentang Game",
            icon: "🛩️",
            content: "Mizeya adalah game petualangan yang mengajak pemain untuk menjelajahi keindahan kepulauan Nusantara menggunakan pesawat. Dalam game ini, Anda akan mengunjungi berbagai pulau di Indonesia, mengungkap misteri, dan menikmati kekayaan budaya serta alam Indonesia."
        },
        {
            title: "Tanggal Rilis",
            icon: "📅",
            content: "2 April 2025"
        },
        {
            title: "Tema",
            icon: "🌴",
            content: "Petualangan Nusantara"
        },
        {
            title: "Pembuat Game",
            icon: "👥",
            content: (
                <div className="creator-list">
                    <p><span className="creator-icon">👩‍💻</span> Shalomita A.C Lasamahu</p>
                    <p><span className="creator-icon">👩‍💻</span> Zahra Ariestya Sennova</p>
                    <p><span className="creator-icon">👩‍💻</span> Widya Ayu Safitri</p>
                    <p><span className="creator-icon">👩‍💻</span> Raqhiqah Athirah Badrun</p>
                </div>
            )
        },
        {
            title: "Tujuan Game",
            icon: "🎯",
            content: (
                <ol className="goals-list">
                    <li>Memperkenalkan keindahan alam dan budaya Indonesia kepada pemain</li>
                    <li>Meningkatkan kesadaran tentang kekayaan Nusantara</li>
                    <li>Menyajikan petualangan seru yang edukatif</li>
                    <li>Mengajak pemain untuk mencintai dan melestarikan warisan Indonesia</li>
                    <li>Melatih kelincahan serta ketepatan pemain</li>
                </ol>
            )
        }
    ];

    return (
        <div className="portfolio-container">
            {/* Background elements */}
            <div className="background-pattern"></div>
            <div className="island-decoration"></div>
            
            {/* Header */}
            <header className="portfolio-header">
                <h1 className="game-title">Mizeya <span className="game-subtitle">Petualangan Nusantara</span></h1>
                <div className="header-decoration"></div>
            </header>

            {/* Audio element */}
            <audio ref={audioRef} id="background-music" loop>
                <source src={music} type="audio/mp3" />
                Browser Anda tidak mendukung audio.
            </audio>

            {/* Top right buttons */}
            <div className="top-right-buttons">
                <button 
                    id="music-toggle" 
                    onClick={toggleMusic}
                    className={`music-btn ${isPlaying ? 'playing' : ''}`}
                >
                    {isPlaying ? "🔊 ON" : "🔇 OFF"}
                </button>
                <button 
                    id="menu-toggle" 
                    onClick={toggleMenu}
                    className="menu-btn"
                >
                    ☰ MENU
                </button>
            </div>

            {/* Dropdown menu */}
            {menuOpen && (
                <div className="menu-dropdown">
                    <button 
                        className="menu-item login-btn" 
                        onClick={handleBackToCover}
                    >
                     ⬅ Kembali ke Cover Game
                    </button>
                    <button 
                        className="menu-item login-btn" 
                        onClick={() => navigate('/login')}
                    >
                        🔑 Login ke Game
                    </button>
                </div>
            )}

            {/* Game info boxes */}
            <div className="info-grid">
                {gameInfoData.map((info, index) => (
                    <div 
                        key={index}
                        className={`game-info ${enlargedBox === index ? 'enlarged' : ''}`}
                        onClick={() => handleBoxClick(index)}
                    >
                        <div className="info-header">
                            <span className="info-icon">{info.icon}</span>
                            <h3 className="info-title">{info.title}</h3>
                        </div>
                        <div className="info-content">{info.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portofolio;