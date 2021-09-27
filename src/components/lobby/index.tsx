import React, {useContext, useEffect, useState} from 'react';
import gameContext, {IPlayer, IGameContext} from '../../gameContext';
import gameService from '../../services/game';
import socketService from '../../services/socket';

export function Lobby(){
    const {roomCode, playerList, setPlayerList} = useContext(gameContext);
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
                console.log(list)
            });
    }

    useEffect(() => {
        updateRoom();
    }, [socket])

    return(
        <div>
            <ul>{listItems}</ul>
            <h3>Room Code: {roomCode}</h3>
        </div>
    )
}