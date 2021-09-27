import { userInfo } from 'os';
import React, {useContext, useEffect, useState} from 'react';
import gameContext, {IPlayer, IGameContext} from '../../gameContext';
import gameService from '../../services/game';
import socketService from '../../services/socket';

export function RoomHandler(){
    const {roomCode, setRoomCode, playerList, setPlayerList} = useContext(gameContext)
    const [name, setName] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const nameChangeHandler = (e: React.ChangeEvent<any>) => {
        const value = e.target.value;
        setName(value);
    };

    const roomChangeHandler = (e: React.ChangeEvent<any>) => {
        const value = e.target.value.toUpperCase();
        setRoomCode(value);
    }

    const createRoom = async () => {
        const socket = socketService.socket;

        if(!socket) return;

        setIsJoining(true);
        const joining = await gameService
            .createRoom(socket, name)
            .catch((err) => {
                alert(err);
            })
        
        if(joining){
            await gameService.roomInfo(socket, (room) => {
                setRoomCode(room.roomID);
                setPlayerList([{id: socket.id, name: name, score: 0}]);
            })
        }
        setIsJoining(false);
    }

    const joinRoom = async () => {
        const socket = socketService.socket;

        if(!roomCode || roomCode.trim() === "" || !socket) return;

        setIsJoining(true);

        const joined = await gameService
            .joinRoom(socket, name, roomCode)
            .catch((err) => {
                alert(err);
            })

        if(joined){
            await gameService.roomInfo(socket, (room) => {
                let list = room.userList
                list.forEach((item: any, index: any, arr: any) => {
                    item["score"] = 0
                })
                setPlayerList(list);
            })
        }

        setIsJoining(false);
    }

    return(
        <div>
            <input placeholder="Name" onChange={nameChangeHandler}/>
            {name !== "" && 
                <div>
                    <input placeholder="Room Code" onChange={roomChangeHandler}/>
                    {(roomCode === "" || roomCode.length < 4) && <button onClick={createRoom} disabled={isJoining}>{isJoining ? "Creating Room..." : "Create Room"}</button>}
                    {roomCode.length === 4 && <button onClick={joinRoom} disabled={isJoining}>{isJoining ? "Joining Room..." : "Join Room"}</button>}
                </div>
            }
        </div>
    )
}