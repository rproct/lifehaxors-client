import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import { incrementRound, modifyPlayers } from '../store/process';
import _ from 'lodash';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>;
    modPlayers: (g: IGame) => (dispatch: DispatchType) => void;
}

export const Lobby: React.FC<Props> = ({currentGame, dispatch, modPlayers}) => {
    const [game, setGame] = useState<IGame>(_.cloneDeep(currentGame));
    const [subbed, setSubbed] = useState(false);
    const socket = socketService.getSocket();

    const playerList = currentGame.players.map((player) => <li key={player.name}>{player.name}</li>)

    const updateRoom = async () => {
        if(!socket) return;

        await gameService.roomInfo(socket, (room) => {
            let list: any[] = room.userList;
            list.forEach((item: any) => {
                item["score"] = 0;
            })
            setGame({
                ...game,
                players: _.cloneDeep(list)
            })
        })
    }

    const startGame = async () => {
        if(!socket) return;
        
        await gameService.emmitStartGame(socket);
    }

    const receiveStartComm = async () => {
        if(!socket) return;

        const signal = await gameService.onStartGame(socket);

        if(signal){
            setGame({
                ...game,
                mode: 'question'
            })
        }
    }

    const getSocketId = () => {
        if(!socket || currentGame.players === undefined) return false;
        else
            return socket.id === currentGame.players[0].id;
    }

    const incremRound = useCallback(
        (g: IGame) => dispatch(incrementRound(g)),
        [dispatch]
    )

    useEffect(() => {
        if(subbed)
           incremRound(game);
    }, [game.mode])

    useEffect(() => {
        if(subbed)
            modPlayers(game);
    }, [game])

    useEffect(() => {
        if(subbed){
            updateRoom();
            receiveStartComm();
        }
    })

    useEffect(() => {
        setSubbed(true);
    }, [])

    return(
        <div>
            <h2>Room Code: {currentGame.room}</h2>
            <ul className="players" id='columns'>{playerList}</ul>
            {getSocketId() && <button disabled={currentGame.players.length < 3} onClick={startGame}>Start</button>}
        </div>
    )
}