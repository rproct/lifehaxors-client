import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import { modifyMode, modifyQuestions } from '../../store/process';

type Props = {
    currentGame: IGame;
    dispatch: Dispatch<any>
}

export const Question: React.FC<Props> = ({currentGame, dispatch}) => {
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

    const modQuestion = useCallback(
        (g: IGame) => dispatch(modifyQuestions(g)),
        [dispatch]
    )

    const modMode = useCallback(
        (g: IGame) => dispatch(modifyMode(g)),
        [dispatch]
    )

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
            list.push({id: question.id, response: question.question});
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
            <h1>Question</h1>
            <span key={0}>{splitTemp[0]}</span>
            {
                splitTemp.slice(1).map((t, index) => {
                    return <span key={index}><input disabled={submitted} required key={index} onChange={event => inputChangeHandler(index, event)}/>{t}</span>
                })
            }
            <button type="submit" disabled={submitted}>Submit</button>
            <h4>{JSON.stringify(game.questions)}</h4>
        </form>
    )
}