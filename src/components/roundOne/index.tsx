import React, {useContext, useEffect, useState} from 'react';
import gameContext from '../../gameContext';
import gameService from '../../services/game';
import socketService from '../../services/socket';
import {Question} from '../question';
import {HouseItems} from '../houseItems';

export function RoundOne(){
    const {mode} = useContext(gameContext);

    return(
        <div>
            {mode === 'question' && <Question/>}
            {mode === 'list' && <HouseItems/>}
        </div>
    )
}