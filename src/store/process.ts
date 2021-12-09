import * as actions from './actions';

export function createRoom(game: IGame){
    const action: GameAction = {
        type: actions.CREATE_ROOM,
        game
    }

    return simHttpReq(action);
}

export function modifyPlayers(game: IGame){
    const action: GameAction = {
        type: actions.MODIFY_PLAYERS,
        game
    }

    return simHttpReq(action);
}

export function incrementRound(game: IGame){
    const action: GameAction = {
        type: actions.INCREMENT_ROUND,
        game
    }

    return simHttpReq(action);
}

export function modifyQuestions(game: IGame){
    const action: GameAction = {
        type: actions.MODIFY_QUESTIONS,
        game
    }

    return simHttpReq(action);
}

export function modifyMode(game: IGame){
    const action: GameAction = {
        type: actions.MODIFY_MODE,
        game
    }

    return simHttpReq(action);
}

export function modifyAnswers(game: IGame){
    const action: GameAction = {
        type: actions.MODIFY_ANSWERS,
        game
    }

    return simHttpReq(action);
}

export function incrementIndex(game: IGame){
    const action: GameAction = {
        type: actions.INCREMENT_INDEX,
        game
    }

    return simHttpReq(action);
}

export function simHttpReq(action: GameAction){
    return (dispatch: DispatchType) => {
        setTimeout(() => {
            dispatch(action)
        }, 500)
    }
}