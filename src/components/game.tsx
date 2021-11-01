import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import { modifyMode, modifyQuestions } from '../store/process';
import { Prompts } from './Prompts';
import {Question, HouseItems} from './subcomponents';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>
}

export const Game: React.FC<Props> = ({currentGame, dispatch}) => {
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
            {(currentGame.mode === 'answer' || currentGame.mode === 'vote') && <Prompts currentGame={currentGame} dispatch={dispatch}/>}
        </div>
    )
}