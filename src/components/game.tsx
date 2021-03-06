import React, {useCallback} from 'react';
import { Dispatch } from 'redux';
import { modifyMode, modifyQuestions } from '../store/process';
import { Prompts } from './Prompts';
import {Question, HouseItems, Results} from './subcomponents';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>;
    modPlayers: (g: IGame) => (dispatch: DispatchType) => void;
}

export const Game: React.FC<Props> = ({currentGame, dispatch, modPlayers}) => {
    const modMode = useCallback(
        (g: IGame) => dispatch(modifyMode(g)),
        [dispatch]
    )

    const modQuestion = useCallback(
        (g: IGame) => dispatch(modifyQuestions(g)),
        [dispatch]
    )

    return(
        <div>
            {currentGame.mode === 'question' && <Question currentGame={currentGame} modQuestion={modQuestion} modMode={modMode}/>}
            {currentGame.mode === 'list' && <HouseItems currentGame={currentGame} modQuestion={modQuestion} modMode={modMode}/>}
            {(currentGame.mode === 'answer' || currentGame.mode === 'vote') && <Prompts currentGame={currentGame} dispatch={dispatch} modMode={modMode} modPlayers={modPlayers}/>}
            {currentGame.mode === 'results' && <Results currentGame={currentGame}/>}
        </div>
    )
}