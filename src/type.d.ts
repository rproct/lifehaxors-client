interface IGame{
    room: string;
    players: IPlayer[];
    round: number;
    mode: 'lobby' | 'question' | 'list' | 'answer' | 'vote' | 'results';
    questions: IQuestion[];
    answers: IResponse[];
    index: number;
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

interface IQuestion extends IResponse{
    houseItems: string[];
}

type GameState = {
    game: IGame
}

type GameAction = {
    type: string
    game: IGame
}

type DispatchType = (args: GameAction) => GameAction;