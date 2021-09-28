import React, {useEffect, useState} from 'react';
import './App.css';
import socketService from './services/socket';
import GameContext, {IGameContext, IPlayer, IQuestion, IList} from './gameContext';
import { RoomHandler } from './components/roomHandler';
import {Lobby} from './components/lobby';
import {RoundOne} from './components/roundOne'

// const socket = io('http://localhost:9000')
function App(){
    const [roomCode, setRoomCode] = useState("");
    const [playerList, setPlayerList] = useState<IPlayer[]>([]);
    const [gameRound, setGameRound] = useState(0);
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [mode, setMode] = useState('question');
    const [list, setList] = useState<IList[]>([]);

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
        setPlayerList,
        gameRound,
        setGameRound,
        mode,
        setMode,
        questions,
        setQuestions,
        list,
        setList
    }

    return(
        <GameContext.Provider value={gameContextVal}>
            {playerList.length === 0 && gameRound === 0 && <RoomHandler/>}
            {playerList.length > 0 && gameRound === 0 && <Lobby/>}
            {gameRound === 1 && <RoundOne/>}
        </GameContext.Provider>
    );
}

export default App;
