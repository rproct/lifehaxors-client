import React from "react";

export interface IList{
    id: string;
    list: string[];
    recipient: string;
}

export interface IQuestion{
    id: string;
    question: string;
}

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
    gameRound: number;
    setGameRound: (round: number) => void;
    mode: string;
    setMode: (newMode: string) => void;
    questions: IQuestion[];
    setQuestions: (res: IQuestion[]) => void;
    list: IList[];
    setList: (newList: IList[]) => void;
}

const defaultState: IGameContext = {
    roomCode: "",
    setRoomCode: () => {},
    playerList: [],
    setPlayerList: () => {},
    gameRound: 0,
    setGameRound: () => {},
    mode: 'question',
    setMode: () => {},
    questions: [],
    setQuestions: () => {},
    list: [],
    setList: () => {}
}

export default React.createContext(defaultState);