import { Socket } from 'socket.io-client';

class GameService {
    public async createRoom(socket: Socket, name: string): Promise<any> {
        return new Promise((rs, rj) => {
            socket.emit('createRoom', {name: name});
            socket.on('roomJoined', (data) => rs(data));
        });
    }

    public async joinRoom(socket: Socket, name: string, room: string): Promise<any> {
        return new Promise((rs, rj) => {
            socket.emit('joinRoom', {name: name, room: room});
            socket.on('roomJoined', (data) => rs(data));
            socket.on('joinRoomErr', ({err}) => rj(err));
        })
    }
}

export default new GameService();