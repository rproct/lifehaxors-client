interface IGame{
    room: string;
    players: IPlayer[];
    round: number;
    mode: 'lobby' | 'question' | 'list' | 'answer' | 'vote';
    questions: IResponse[];
    houseItems: string[];
    answers: IResponse[];
}

interface IPlayer{
    id: string;
    name: string;
    score: number;
}

interface IResponse{
    id: string;
    response: string;
}

type GameState = {
    game: IGame
}

type GameAction = {
    type: string
    game: IGame
}

type DispatchType = (args: GameAction) => GameAction;