import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import _ from 'lodash';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>;
}

export const Voting: React.FC<Props> = ({currentGame, dispatch}) => {
    const [ans, setAns] = useState();

    const selected = (ans: any) => {
        console.log(ans)
    }

    useEffect(() => {
        let temp: any = [];
        currentGame.answers.map((value) => {
            temp.push({id: value.id, response: value.response, selected: false})
        })
        setAns(temp);
    }, [])

    return(
        <ul>{
            currentGame.answers.map((value) => <ClickableAns key={value.id} ans={value.response} selected={selected}/>) 
        }</ul>
    )
}

type subProps = {
    ans: string;
    selected: (ans: any) => void; 
}
const ClickableAns: React.FC<subProps> = ({ans, selected}) => {
    return(<li onClick={selected}>{ans}</li>)
}