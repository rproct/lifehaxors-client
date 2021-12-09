import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import socketService from '../../services/socketService';
import _ from 'lodash';
import gameService from '../../services/gameService';
import { incrementIndex, modifyAnswers } from '../../store/process';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>;
    id: string | undefined;
    modMode: (g: IGame) => (dispatch: DispatchType) => void;
}

export const Voting: React.FC<Props> = ({currentGame, dispatch, id, modMode}) => {
    const socket = socketService.getSocket();
    const [ans, setAns] = useState<any []>();
    const [game, setGame] = useState(currentGame);

    const modAns = useCallback(
        (g: IGame) => dispatch(modifyAnswers(g)),
        [dispatch]
    )

    const incrIndex = useCallback(
        (g: IGame) => dispatch(incrementIndex(g)),
        [dispatch]
    )

    const selected = async (player: string) => {
        if(socket)
            if(id === socket.id){
                console.log(player)
            }
    }

    useEffect(() => {
        let temp: any = [];
        currentGame.answers.map((value) => {
            temp.push({id: value.id, response: value.response})
        })
        setAns(temp);
    }, [])

    const startGame = async () => {
        if(!socket) return;
        
        await gameService.emmitStartGame(socket);
    }

    const receiveStartComm = async () => {
        if(!socket) return;

        const signal = await gameService.onStartGame(socket);

        if(signal){
            setGame({...game,
                answers: [],
                mode: 'answer',
                index: currentGame.index + 1
            })
        }
    }

    useEffect(() => {
        if(game.index === game.players.length){
            window.location.reload()
        }
        incrIndex(game);
        modAns(game);
        modMode(game);
    }, [game])

    useEffect(() => {
        receiveStartComm();
    })

    return(
        <div>
            <ul>{
                ans?.map((value) => <ClickableAns key={value.id} ans={value.response} selected={selected} player={value.id}/>) 
            }</ul>
            {id === socket?.id && <button onClick={startGame}>Next</button>}
        </div>
    )
}

type subProps = {
    ans: string;
    selected: (ans: any) => void;
    player: string;
}
const ClickableAns: React.FC<subProps> = ({ans, selected, player}) => {
    return(<li onClick={() => selected(player)}>{ans}</li>)
}