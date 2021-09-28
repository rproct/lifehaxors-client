import React, {useContext, useEffect} from 'react';
import gameContext from '../../gameContext';
import gameService from '../../services/game';
import socketService from '../../services/socket';

export function Lobby(){
    const {roomCode, playerList, setPlayerList, setGameRound} = useContext(gameContext);
    const socket = socketService.socket;

    const listItems = playerList.map((player) => <li>{player.name}</li>)

    const updateRoom = async () => {
        if(socket)
            await gameService.roomInfo(socket, (room) => {
                let list = room.userList;
                list.forEach((item: any, index: any, arr: any) => {
                    item["score"] = 0
                })
                setPlayerList(list);
            });
    }

    const startGame = async () => {
        if(!socket) return;
        
        await gameService.emmitStartGame(socket);
    }

    const receiveStartComm = async () => {
        if(!socket) return;

        const signal = await gameService.onStartGame(socket);

        if(signal){
            setGameRound(1);
        }
    }

    useEffect(() => {
        updateRoom();
        receiveStartComm();
    }, [socket])

    return(
        <div>
            <ul>{listItems}</ul>
            <h3>Room Code: {roomCode}</h3>
            {playerList[0].id === socket?.id && <button disabled={playerList.length < 4} onClick={startGame}>Start</button>}
        </div>
    )
}