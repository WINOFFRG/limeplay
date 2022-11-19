import React from "react";
import ReactDOM from "react-dom/client";
import MainPlayer from "./components/MainPlayer";
import { ReactShakaPlayer } from "./components/player";
import PlayerOverlay from "./components/PlayerOverlay";

import "./globals.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MainPlayer />
    </React.StrictMode>
);
