import { Socket } from 'socket.io-client';

class GameService {
    public async createRoom(socket: Socket, name: string): Promise<boolean> {
        return new Promise((rs, rj) => {
            socket.emit('createRoom', {name: name});
            socket.on('joinedSuccess', () => rs(true));
        });
    }

    public async joinRoom(socket: Socket, name: string, room: string): Promise<boolean> {
        return new Promise((rs, rj) => {
            socket.emit('joinRoom', {name: name, roomID: room});
            socket.on('joinedSuccess', () => rs(true));
            socket.on('joinRoomErr', ({err}) => rj(err));
        })
    }

    public async roomInfo(socket: Socket, listener: (room: any) => void){
        socket.on("updateRoom", (room) => listener(room));
    }
}

export default new GameService();