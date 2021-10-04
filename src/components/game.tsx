import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import {Question, HouseItems} from './subcomponents';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>
}

export const Game: React.FC<Props> = ({currentGame, dispatch}) => {
    

    return(
        <div>
            {currentGame.mode === 'question' && <Question currentGame={currentGame} dispatch={dispatch}/>}
            {currentGame.mode === 'list' && <HouseItems currentGame={currentGame} dispatch={dispatch}/>}
        </div>
    )
}