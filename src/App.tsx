import React, { useEffect } from 'react';
import './App.css';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {Dispatch} from 'redux';
import socketService from './services/socketService';
import {RoomHandler} from './components/roomHandler';
import { Lobby } from './components/lobby';
import { Game } from './components/game';

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

  useEffect(() => {
    connectSocket();
  }, [])

  return (
    <div>
    <header className='page-header'>
      <img src='logoi.png' className='logo' alt='' /> 
      <h1>Lifehaxors</h1>
    </header>
      <div className='flex'>
      {game.round === -1 && <RoomHandler currentGame={game} dispatch={dispatch}/>}
      {game.mode === 'lobby' && game.round === 0 && <Lobby currentGame={game} dispatch={dispatch}/>}
      {game.mode !== 'lobby' && game.round >= 1 && <Game currentGame={game} dispatch={dispatch}/>}
      </div>
      {/* <h3>{JSON.stringify(game)}</h3> */}
 </div>  
  );
}

export default App;
