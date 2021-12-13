import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';

type Props = {
    time: number;
    currentGame: IGame;
    newMode: 'lobby' | 'question' | 'list' | 'answer' | 'vote';
    modMode: (g: IGame) => (dispatch: DispatchType) => void;
}

export const Timer: React.FC<Props> = ({time, currentGame, modMode, newMode}) => {
    const [seconds, setSeconds] = useState(time);
    const [game, setGame] = useState(currentGame);

    useEffect(() => {
        if(seconds > 0)
            setTimeout(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        else
            setGame({
                ...game, 
                mode: newMode
            })
    }, [seconds])

    useEffect(() => {
        modMode(game);
    }, [game])

    return(
        <h1 id="timer">{seconds}</h1>
    )
}