import React, {useContext, useEffect, useState} from 'react';
import gameContext from '../../gameContext';
import gameService from '../../services/game';
import socketService from '../../services/socket';

export function HouseItems(){
    const [items, setItems] = useState<string[]>(['', '', '']);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [recipient, setRecipient] = useState('');

    const {list, setList, playerList, setMode} = useContext(gameContext);

    const socket = socketService.socket;

    const pairUp = async () => {
        if(!socket || socket.id !== playerList[0].id) return;

        await gameService.generatePairs(socket);
    }

    const getPair = async () => {
        if(!socket) return;

        await gameService.getPair(socket, (pair) => {
            setRecipient(pair.recipient);
        })
    }

    const handleInputChange = (index: any, e: React.ChangeEvent<any>) => {
        const arr = items;
        arr[index] = e.target.value;
        setItems(arr);
    }

    const check = async () => {
        for(let i = 0; i < items.length; i++)
            if(items[i] === ''){
                alert("Fill out all the boxes!");
                return;
            }
        
        if(!socket) return;
        await gameService.sendList(socket, items, recipient);
        setHasSubmitted(true);
    }

    const getItems = async () => {
        if(!socket) return;

        await gameService.receiveList(socket, (data) => {
            const itemSet = list;
            itemSet.push({id: data.id, list: data.list, recipient: data.recipient})
            setList(itemSet);
        })

        if(list.length === playerList.length){
            setMode('answer');
        }
    }

    useEffect(() => {
        pairUp();
    }, [])

    useEffect(() => {
        getPair();
        getItems();
    }, [socket])

    return(
        <div>
            <h2>Name 3 items in your house</h2>
            {
                items.map((t, index) => {
                    return <div><input required onChange={event => handleInputChange(index, event)} disabled={hasSubmitted}/></div>
                })
            }
            <button disabled={hasSubmitted} onClick={check}>Submit</button>
        </div>
    )
}