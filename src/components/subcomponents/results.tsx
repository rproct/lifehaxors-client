import React, { useEffect, useState } from "react";
import _ from 'lodash';

type Props = {
    currentGame: IGame;
}

export const Results: React.FC<Props> = ({currentGame}) => {
    const [playerList, setPlayerList] = useState<IPlayer[]>();
    const [game, setGame] = useState(currentGame);

    useEffect(() => {
        let players = _.cloneDeep(currentGame.players);
        players.sort((a, b) => b.score - a.score);
        setPlayerList(players)
    }, [])

    const newGame = () => {
        window.location.reload();
    }

    const playAgain = () => {

    }

    return(
        <div>
            <h2>Results</h2>
            <ol>
                {playerList?.map((player) => <li key={player.id}>{player.name} {player.score}</li>)}
            </ol>
            <button onClick={newGame}>New Game</button>
            {/* <button onClick={playAgain}>Play Again</button> */}
        </div>
    )
}