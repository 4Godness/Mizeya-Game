import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './style.css'; // Global styles
import CoverGame from "./CoverGame";
import Portofolio from "./Portofolio";
import Setting from "./Setting";
import Game from "./Game";
import Login from "./Login";
import Maluku from './Maluku';
import Sulawesi from './Sulawesi';
import Jawa from './Jawa';
import Sumatera from './Sumatera';
import Kalimantan from './Kalimantan'


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoverGame />} />
        <Route path="/cover-game" element={<CoverGame />} />
        <Route path="/portfolio" element={<Portofolio />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/maluku" element={<Maluku />} />
        <Route path="/sulawesi" element={<Sulawesi />} />
        <Route path="/jawa" element={<Jawa />} />
        <Route path="/sumatera" element={<Sumatera />} />
        <Route path="/kalimantan" element={<Kalimantan />} />
      </Routes>
    </Router>
  );
}
