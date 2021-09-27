import React from "react";

export interface IPlayer{
    id: string;
    name: string;
    score: number;
}

export interface IGameContext{
    roomCode: string;
    setRoomCode: (code: string) => void;
    playerList: IPlayer[];
    setPlayerList: (players: IPlayer[]) => void;
}

const defaultState: IGameContext = {
    roomCode: "",
    setRoomCode: () => {},
    playerList: [],
    setPlayerList: () => {}
}

export default React.createContext(defaultState);