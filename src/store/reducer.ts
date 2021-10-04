import { stat } from 'fs';
import _ from 'lodash';
import * as actions from './actions';

const initState: GameState = {
    game: {
        room: '',
        players: Array<IPlayer>(),
        round: -1,
        mode: 'lobby',
        questions: Array<IResponse>(),
        houseItems: Array<string>(),
        answers: Array<IResponse>()
    }
}

const reducer = (
    state: GameState = initState,
    action: GameAction
): GameState => {
    switch(action.type){
        case actions.CREATE_ROOM:
            return{
                ...state,
                game: {
                    ...state.game,
                    round: action.game.round,
                    room: action.game.room,
                    players: state.game.players.concat(_.cloneDeep(action.game.players))
                }
            }
        case actions.MODIFY_PLAYERS:
            return{
                ...state,
                game: {
                    ...state.game,
                    players: _.cloneDeep(action.game.players),
                    mode: action.game.mode
                }
            }
        case actions.INCREMENT_ROUND:
            return{
                ...state,
                game: {
                    ...state.game,
                    round: (state.game.round + 1) % 4
                }
            }
        case actions.MODIFY_QUESTIONS:
            return{
                ...state,
                game: {
                    ...state.game,
                    questions: _.cloneDeep(action.game.questions)
                }
            }
        case actions.MODIFY_MODE:
            return{
                ...state,
                game: {
                    ...state.game,
                    mode: action.game.mode
                }
            }
    }
    return state;
}

export default reducer;