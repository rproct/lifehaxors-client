import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>;
}

export const HouseItems: React.FC<Props> = ({currentGame, dispatch}) => {
    return(
        <form></form>
    )
}