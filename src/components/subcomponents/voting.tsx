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
    modPlayers: (g: IGame) => (dispatch: DispatchType) => void;
}

export const Voting: React.FC<Props> = ({currentGame, dispatch, id, modMode, modPlayers}) => {
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

    const selected = async (playerID: string) => {
        if(socket)
            if(id === socket.id){
                await gameService.sendAnswer(socket, {id: playerID});
                const index = game.players.findIndex(player => player.id === playerID);
                
            }
    }

    const addScore = async () => {
        if(!socket) return;

        await gameService.receiveAnswer(socket, (data) => {
            const playerID = data.data.id
            const index = game.players.findIndex(player => player.id === playerID)
            const players = game.players;
            players[index].score += 100;
            if(game.index + 1 === game.players.length)
                setGame({
                    ...game,
                    players: players,
                    mode: 'results',
                    index: 0,
                    answers: []
                });
            else
                setGame({
                    ...game,
                    players: players,
                    mode: 'answer',
                    index: currentGame.index + 1,
                    answers: []
                });
        })
    }

    useEffect(() => {
        addScore();
    }, [socket])

    useEffect(() => {
        let temp: any = [];
        currentGame.answers.map((value) => {
            temp.push({id: value.id, response: value.response})
        })
        setAns(temp);
    }, [])

    useEffect(() => {
        modAns(game);
        modPlayers(game);
        incrIndex(game);
        modMode(game);
    }, [game])

    return(
        <div>
            <h3>Suggestions{id === socket?.id && ' for you'}:</h3>
            <ul>{
                ans?.map((value) => <ClickableAns key={value.id} ans={value.response} selected={selected} player={value.id}/>) 
            }</ul>
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