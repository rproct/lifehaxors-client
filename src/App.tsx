import React, {useEffect, useState} from 'react';
import './App.css';
import socketService from './services/socket';
import GameContext, {IGameContext, IPlayer} from './gameContext';
import { RoomHandler } from './components/roomHandler';
import {Lobby} from './components/lobby'

// const socket = io('http://localhost:9000')
function App(){
    const [roomCode, setRoomCode] = useState("");
    const [playerList, setPlayerList] = useState<IPlayer[]>([]);

    const connectSocket = async () => {
        const socket = await socketService
            .connect('http://localhost:9000')
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    useEffect(() => {
        connectSocket();
    }, []);

    const gameContextVal: IGameContext = {
        roomCode,
        setRoomCode,
        playerList,
        setPlayerList
    }

    return(
        <GameContext.Provider value={gameContextVal}>
            {playerList.length === 0 && <RoomHandler/>}
            {playerList.length > 0 && <Lobby/>}
        </GameContext.Provider>
    );
}

export default App;
