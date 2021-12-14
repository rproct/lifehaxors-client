import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import {Timer} from './timer'

type Props = {
    currentGame: IGame;
    modQuestion: (g: IGame) => (dispatch: DispatchType) => void;
    modMode: (g: IGame) => (dispatch: DispatchType) => void;
}

export const Question: React.FC<Props> = ({currentGame, modQuestion, modMode}) => {
    const [response, setResponse] = useState<string[]>([]);
    const [template, setTemplate] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [game, setGame] = useState<IGame>(currentGame);
    const socket = socketService.getSocket();

    const randomQuestion = async () => {
        if(!socket) return;

        await gameService.getTemplate(socket);
        await gameService
            .applyTemplate(socket, (quest) => {
                setTemplate(quest.question);
            })
            .catch((err) => {
                alert(err);
            });
    }

    const splitTemp = template.split("*BLANK*");

    const inputChangeHandler = (index: number, e: React.FormEvent<HTMLInputElement>) => {
        const inp = response;
        inp[index] = e.currentTarget.value;
        setResponse(inp);
    }

    const sendQuestion = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!socket) return;

        let str = '';
        for(let i = 0, j = 0; j < response.length; i++, j++)
            str += splitTemp[i] + response[j];
        str += splitTemp[splitTemp.length - 1];

        await gameService.sendQuestion(socket, str)
            .catch((err) => {
                alert(err);
            });
        
        setSubmitted(true)
    }

    const receiveQuestions = async () => {
        if(!socket) return;

        await gameService.receiveQuestion(socket, (question) => {
            const list = game.questions;
            list.push({id: question.id, response: question.question, houseItems: []});
            setGame({
                ...game,
                questions: _.cloneDeep(list)
            });
        })
    }

    useEffect(() => {
        if(currentGame.questions.length === currentGame.players.length){
            let tempGame = game;
            tempGame.mode = 'list';
            modMode(tempGame)
        }
    }, [currentGame])

    useEffect(() => {
        modQuestion(game);
    }, [game])

    useEffect(() => {
        receiveQuestions();
    }, [socket])

    useEffect(() => {
        randomQuestion();
    }, [])

    return(
        <form onSubmit={sendQuestion}>
            <div className='flex-between'>
                <h1>Question</h1>
                <Timer time={60} currentGame={game} modMode={modMode} newMode='list'/>
            </div>
            <div id='question'>
                <span key={0}>{splitTemp[0]}</span>
                {
                    splitTemp.slice(1).map((t, index) => {
                        return <span key={index}><input disabled={submitted} required key={index} onChange={event => inputChangeHandler(index, event)}/>{t}</span>
                    })
                }
            </div>
            <br/>
            <button className='no-border' type="submit" disabled={submitted}>Submit</button>
            {/* <h4>{JSON.stringify(game.questions)}</h4> */}
        </form>
    )
}