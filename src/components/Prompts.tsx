import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import { modifyMode, modifyQuestions } from '../store/process';
import {Question, HouseItems} from './subcomponents';
import _ from 'lodash'

type Props = {
    currentGame: IGame;
}

export const Prompts: React.FC<Props> = ({currentGame}) => {
    const [order, setOrder] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const socket = socketService.getSocket();

    const getOrder = async () => {
        if(!socket) return;

        if(socket.id === currentGame.players[0].id)
            await gameService.getOrder(socket);
    }

    const generateOrder = async () => {
        if(!socket) return;

        await gameService.generateOrder(socket, (o) => {
            const list: string[] = [];
            o.order.map((item: any) => {
                list.push(item.id);
            })
            setOrder(_.cloneDeep(list))
        })
    }

    const getQuestion = currentGame.questions.find(quest => quest.id === order[index])

    const getList = getQuestion?.houseItems.map((item) => <li key={item}>{item}</li>)

    const incrementIndex = () => {
        setIndex(index + 1);
    }

    useEffect(() => {
        generateOrder();
    }, [socket])

    useEffect(() => {
        getOrder()
    }, [])

    return(
        <form>
            <h2>Question:</h2>
            <span>{JSON.stringify(order)}</span>
            <p>{getQuestion?.response}</p>
            <p>This is what I have at my house:</p>
            <ul>{getList}</ul>
            <p>What can I do?</p>
            <textarea rows={10} cols={100}/>
            <button>Submit</button>
        </form>
    )
}