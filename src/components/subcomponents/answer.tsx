import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import _ from 'lodash';
import { Socket } from '../../../node_modules/socket.io-client/build';
import { modifyAnswers } from '../../store/process';

type Props = {
    getQuestion: IQuestion | undefined;
    list: any;
    incre: () => void;
    currentGame: IGame;
    dispatch: Dispatch<any>;
}

export const Answer: React.FC<Props> = ({getQuestion, list, incre, currentGame, dispatch}) => {
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
            await gameService.sendAnswer(socket, data);
            setSubmit(true);
        }
    }

    const wordComp = () => {
        if(getQuestion)
            return 3 > text.split(' ').filter(
                word => getQuestion.houseItems.includes(word)).filter(
                    (value, index, self) => self.indexOf(value) === index
                ).length;
        return true;
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

    useEffect(() => {
        console.log(game.answers)
        modAns(game);
    }, [game])

    useEffect(() => {
        getAnswers();
    }, [socket])

    return(
        <form onSubmit={sendAnswer}>
            
            <p>What can I do? (Using at least 3 items in my home)</p>
            <textarea onChange={textChangeHandler} rows={10} cols={100}/>
            <button type="submit" disabled={wordComp() && !submitted}>Submit</button>
            <p>{JSON.stringify(game.answers)}</p>
        </form>
    );
}