import React, { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
// import socketService from './services/socket';

const socket = io('http://localhost:9000')
class App extends React.Component{
  constructor(props: any) {
    super(props);

    this.state = {currentComponent: 'welcome'}
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default App;
