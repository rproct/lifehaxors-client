import React, {useEffect, useState} from 'react';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import _ from 'lodash';
import {Timer} from './timer'

type Props = {
    currentGame: IGame;
    modQuestion: (g: IGame) => (dispatch: DispatchType) => void;
    modMode: (g: IGame) => (dispatch: DispatchType) => void;
}

/**
 * 
 * @param param0 
 * @returns 
 */
export const HouseItems: React.FC<Props> = ({currentGame, modQuestion, modMode}) => {
    const [game, setGame] = useState<IGame>(currentGame);
    const [response, setResponse] = useState<string[]>(['', '', '', '', '', '']);
    const [submitted, setSubmitted] = useState(false);
    const [playersReady, setPlayersReady] = useState(0);
    const socket = socketService.getSocket();

    const inputChangeHandler = (index: number, e: React.FormEvent<HTMLInputElement>) => {
        const inp = response;
        inp[index] = e.currentTarget.value;
        setResponse(inp);
    }

    const submitItems = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!socket) return;

        setSubmitted(true);
        await gameService.addListItems(socket, response);
    }

    const readyUp = async () => {
        if(!socket) return;
        
        await gameService.getPlayersReady(socket, (num) => {
            setPlayersReady(num)
        })
    }

    const sendCommand = async () => {
        if(!socket) return;

        if(socket.id === currentGame.players[0].id)
            await gameService.appendListToQuestions(socket);
    }

    const changeMode = async () => {
        if(!socket) return;

        await gameService.setQuestionList(socket, (data) => {
            let questions: IQuestion[] = game.questions;
            data.dist.map((arr: any) => {
                let index = questions.findIndex(quest => quest.id === arr.id);
                questions[index].houseItems = _.cloneDeep(arr.items);
            })
            setGame({
                ...game,
                mode: 'answer',
                questions: _.cloneDeep(questions)
            })
        })
    }

    useEffect(() => {
        modMode(game);
    }, [currentGame])

    useEffect(() => {
        console.log(game);
        modQuestion(game);
    }, [game])

    useEffect(() => {
        if(playersReady === game.players.length)
            sendCommand();
    }, [playersReady])

    useEffect(() => {
        readyUp();
        changeMode();
    }, [socket])

    return(
        <form onSubmit={submitItems}>
            <Timer time={60} currentGame={game} modMode={modMode} newMode='answer'/>
            <h2>What are the six items in your house?</h2>
            <div id='columns'>
                {
                    response.map((item, index) => {
                        return <span><input 
                                        required 
                                        placeholder={`Item ${index + 1}`} 
                                        key={index}
                                        onChange={event => inputChangeHandler(index, event)}
                                        disabled={submitted}
                                        className='margin1em'
                                    /><br/></span>
                    })
                }
            </div>
            <button type="submit" disabled={submitted} className='margin1em'>Submit</button>
            {/* <h4>{playersReady}</h4> */}
            {/* <h4>{JSON.stringify(game.questions)}</h4> */}
        </form>
    )
}