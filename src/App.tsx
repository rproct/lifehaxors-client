import React, {useEffect} from 'react';
import './App.css';
import io from 'socket.io-client';
import socketService from './services/socket';

// const socket = io('http://localhost:9000')
function App(){
    const connectSocket = async () => {
        const socket = await socketService
            .connect('http://localhost:9000')
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    useEffect(() => {
        connectSocket();
    }, []);

    return(
        <div></div>
    );
}

export default App;
