import React, { useCallback, useEffect } from 'react';
import './App.css';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {Dispatch} from 'redux';
import socketService from './services/socketService';
import {RoomHandler} from './components/roomHandler';
import { Lobby } from './components/lobby';
import { Game } from './components/game';
import { modifyPlayers } from './store/process';

/**
 * 
 * @returns 
 */
function App() {
  const game: IGame = useSelector(
    (state: GameState) => state.game,
    shallowEqual
  )

  const dispatch: Dispatch<any> = useDispatch();

  const connectSocket = async () => {
    const socket = await socketService
      .connect('https://lifehaxors-server.herokuapp.com')
      .catch((err) => {
          console.log("Error: ", err);
      });
  }

  const modPlayers = useCallback(
    (g: IGame) => dispatch(modifyPlayers(g)),
    [dispatch]
  )

  useEffect(() => {
    connectSocket();
  }, [])

  return (
    <div>
      <h1>Lifehaxors Pre-Alpha</h1>
      <div className='flex'>
      {game.round === -1 && <RoomHandler currentGame={game} dispatch={dispatch}/>}
      {game.mode === 'lobby' && game.round === 0 && <Lobby currentGame={game} dispatch={dispatch} modPlayers={modPlayers}/>}
      {game.mode !== 'lobby' && game.round >= 1 && <Game currentGame={game} dispatch={dispatch} modPlayers={modPlayers}/>}
      </div>
      {JSON.stringify(game.players)}
    </div>
  );
}

export default App;
