import React, {useCallback, useEffect, useState} from 'react';

type Props = {
    time: number;
}

export const Timer: React.FC<Props> = ({time}) => {
    const [seconds, setSeconds] = useState(time);

    useEffect(() => {
        if(seconds > 0)
            setTimeout(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
    }, [seconds])

    return(
        <h1>{seconds}</h1>
    )
}