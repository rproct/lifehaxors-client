import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch } from 'redux';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import _ from 'lodash';

type Props = {
    getQuestion: IQuestion | undefined;
    list: any;
    incre: () => void;
}

export const Answer: React.FC<Props> = ({getQuestion, list, incre}) => {
    const [text, setText] = useState('');

    const textChangeHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value);
    }

    const sendAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    const wordComp = () => {
        if(getQuestion)
            return 3 > text.split(' ').filter(
                word => getQuestion.houseItems.includes(word)).filter(
                    (value, index, self) => self.indexOf(value) === index
                ).length;
        return true;
    }

    return(
        <form onSubmit={sendAnswer}>
            
            <p>What can I do? (Using at least 3 items in my home)</p>
            <textarea onChange={textChangeHandler} rows={10} cols={100}/>
            <button type="submit" disabled={wordComp()}>Submit</button>
            
        </form>
    );
}