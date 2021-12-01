import React, {useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import socketService from '../../services/socketService';
import _ from 'lodash';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>;
    id: string | undefined;
}

export const Voting: React.FC<Props> = ({currentGame, dispatch, id}) => {
    const socket = socketService.getSocket();
    const [ans, setAns] = useState<any []>();

    const selected = (ans: any) => {
        if(id === socket){
            console.log(ans)
        }
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
            ans?.map((value) => <ClickableAns key={value.id} ans={value.response} selected={selected}/>) 
        }</ul>
    )
}

type subProps = {
    ans: string;
    selected: (ans: any) => void; 
}
const ClickableAns: React.FC<subProps> = ({ans, selected}) => {
    return(<li onClick={() => selected(ans)}>{ans}</li>)
}