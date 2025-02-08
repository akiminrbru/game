import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";

export const App = () => {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
        </div>
    );
};
