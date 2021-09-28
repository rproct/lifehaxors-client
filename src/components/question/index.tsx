import React, {useContext, useEffect, useState} from 'react';
import gameContext, {IQuestion} from '../../gameContext';
import gameService from '../../services/game';
import socketService from '../../services/socket';

export function Question(){
    const [response, setResponse] = useState<IQuestion[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [tempQuest, setTempQuest] = useState('');
    const {questions, setQuestions, setMode, playerList} = useContext(gameContext);
    const socket = socketService.socket;

    const randomQuestion = async () => {
        if(!socket) return;
        await gameService.getTemplate(socket);
        await gameService
            .applyTemplate(socket, (quest) => {
                setTempQuest(quest.question)
            })
            .catch((err) => {
                alert(err);
            });
    }

    const splitQuest = tempQuest.split("*BLANK*");

    // questionTemplates[Math.floor(Math.random() * questionTemplates.length)]
    //     .question.split("*BLANK*");
    
    const inputChangeHandler = (index: any, e: React.ChangeEvent<any>) => {
        const inp = response;
        inp[index] = e.target.value;
        setResponse(inp);
    }

    const check = async () => {
        let str = ''
        for(let i = 0, j = 0; j < response.length; i++, j++){
            str += splitQuest[i] + response[j];
        }
        str += splitQuest[splitQuest.length - 1];
        
        if(!socket) return;

        await gameService.sendQuestion(socket, str)
            .catch((err) => {
                alert(err);
            });
        
        setHasSubmitted(true);
    }

    const getQuestions = async () => {
        if(!socket) return;

        const sent = await gameService.receiveQuestion(socket, (question) => {
            const list = questions;
            list.push({id: question.id, question: question.question})
            setQuestions(list);
            console.log(questions);
            if(questions.length === playerList.length){
                setMode('list');
            }
        })
    }

    useEffect(() => {
        getQuestions();
    }, [socket])

    useEffect(() => {
        randomQuestion();
    }, [])

    return(
        <div>
            {splitQuest[0]}
            {
                splitQuest.slice(1).map((t, index) => {
                    return <span><input required key={index} onChange={event => inputChangeHandler(index, event)} disabled={hasSubmitted}/>{t}</span>
                })
            }
            <br/>
            <button onClick={check} disabled={hasSubmitted}>Submit</button>
        </div>
    )
}