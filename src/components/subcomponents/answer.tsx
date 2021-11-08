import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import _ from 'lodash';
import { Socket } from '../../../node_modules/socket.io-client/build';
import { modifyAnswers } from '../../store/process';

type Props = {
    getQuestion: IQuestion | undefined;
    currentGame: IGame;
    dispatch: Dispatch<any>;
    modMode: (g: IGame) => (dispatch: DispatchType) => void;
}

export const Answer: React.FC<Props> = ({getQuestion, currentGame, dispatch, modMode}) => {
    const [text, setText] = useState('');
    const [submitted, setSubmit] = useState(false);
    const [game, setGame] = useState<IGame>(currentGame);
    const socket = socketService.getSocket();

    const modAns = useCallback(
        (g: IGame) => dispatch(modifyAnswers(g)),
        [dispatch]
    )

    const textChangeHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value);
    }

    const sendAnswer = async (e: React.FormEvent) => {
        e.preventDefault();

        let socket = socketService.getSocket()
        if(socket && getQuestion){
            let data = {id: socket.id, answer: text}
            setSubmit(true);
            await gameService.sendAnswer(socket, data);
        }
    }

    const wordComp = () => {
        if(getQuestion){
            const list = getQuestion.houseItems.map(item => item.toLowerCase())
            return 3 > text.split(' ').filter(
                word => list.includes(word.toLowerCase())).filter(
                    (value, index, self) => self.indexOf(value) === index
                ).length;
        }
        return false;
    }

    const getAnswers = async () => {
        if(!socket) return;

        await gameService.receiveAnswer(socket, (data) => {
            let ans = data.data;
            let answers = currentGame.answers
            answers.push({id: ans.id, response: ans.answer});
            setGame({
                ...game,
                answers: answers
            })
        })
    }

    const toVote = () => {
        if(currentGame.answers.length === currentGame.players.length - 1){
            setGame({
                ...game,
                mode: 'vote'
            })
        }
    }

    const getCondition = () => {
        // return (wordComp() || !submitted) && (wordComp() !== !submitted);
        return wordComp() === !submitted;
    }

    useEffect(() => {
        toVote();
    }, [currentGame])

    useEffect(() => {
        modAns(game);
        modMode(game);
    }, [game])

    useEffect(() => {
        getAnswers();
    }, [socket])

    return(
        socket?.id !== getQuestion?.id ? 
        <form onSubmit={sendAnswer}>
            <p>What can I do? (Using at least 3 items in my home)</p>
            <textarea 
                placeholder='Enter your solution'
                onChange={textChangeHandler}
                rows={10}
                cols={100} 
                disabled={submitted} 
                onKeyPress={e => {if(e.key === 'Enter') e.preventDefault()}}
            />
            <button type="submit" disabled={getCondition()}>Submit</button>
            <p>{currentGame.answers.length} === {currentGame.players.length - 1}</p>
            {/* <h3>{JSON.stringify(wordComp())} - {JSON.stringify(!submitted)} --&gt; {JSON.stringify(getCondition())}</h3> */}
            {/* <p>{JSON.stringify(game.answers)}</p> */}
        </form> :
        <p>This is your prompt. Hang in there, help is on the way!</p>
    );
}