import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import {createRoom} from '../store/process'

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>
}

export const RoomHandler: React.FC<Props> = ({currentGame, dispatch}) => {
    const [game, setGame] = useState<IGame>(currentGame);
    const [room, setRoom] = useState('');
    const [name, setName] = useState('');
    const socket = socketService.getSocket();

    const nameChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const roomChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setRoom(e.currentTarget.value.toUpperCase());
    }

    const newRoom = React.useCallback(
        (game: IGame) => dispatch(createRoom(game)),
        [dispatch]
    );

    const appendScores = (players: IPlayer[]) => {
        let list = players;
        list.forEach((item: any) => {
            item["score"] = 0;
        })
        return list;
    }

    const socketCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!socket) return;

        const joining = await gameService
            .createRoom(socket, name)
            .catch((err) => {
                alert(err);
            });
        
        if(joining){
            await gameService.roomInfo(socket, (temp) => {
                if(temp){
                    let list = appendScores(temp.userList)
                    setGame({
                        ...game,
                        players: _.cloneDeep(list),
                        room: temp.roomID,
                        round: 0
                    })
                }
            });
        }
    }

    const socketJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!socket) return;

        const joining = await gameService
            .joinRoom(socket, name, room)
            .catch((err) => {
                alert(err);
            });

        if(joining){
            const temp = await gameService.roomInfo(socket, (temp) => {
                if(temp){
                    let list = appendScores(temp.userList)
                    setGame({
                        ...game,
                        players: _.cloneDeep(list),
                        room: temp.roomID,
                        round: 0
                    })
                }
            });
        }
    }

    useEffect(() => {
        newRoom(game);
    }, [game]);

    return(
        <form onSubmit={room.length === 4 ? socketJoinRoom : socketCreateRoom} id='stack'>
            <input
                type="text"
                id="name"
                placeholder="Username"
                onChange={nameChangeHandler}
                className='margin1em bolded-border'
            />
            <input
                type="text"
                id="room"
                placeholder="Room Code"
                onChange={roomChangeHandler}
                maxLength={4}
                disabled={name.length === 0}
                className='margin1em bolded-border'
            />
            <button disabled={name.length === 0} type="submit" className='margin1em no-border'>{room.length < 4 ? "Create Room" : "Join Room"}</button>
        </form>
    )
}