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
            socket.on('joinRoomErr', (err) => rj(err.error));
        })
    }

    public async roomInfo(socket: Socket, listener: (room: any) => void){
        socket.on("updateRoom", (room) => listener(room));
    }

    public async emmitStartGame(socket: Socket){
        socket.emit("startGame");
    }

    public async onStartGame(socket: Socket): Promise<boolean>{
        return new Promise((rs) => {
            socket.on("toggleStart", () => rs(true));
        })
    }

    public async getTemplate(socket: Socket){
        socket.emit("sendTemplate");
    }

    public async applyTemplate(socket: Socket, listener: (quest: any) => void){
        socket.on("receiveTemplate", (quest) => listener(quest));
    }

    public async sendQuestion(socket: Socket, question: string){
        socket.emit("sendQuestion", {question: question});
    }

    public async receiveQuestion(socket: Socket, listener: (question: any) => void){
        socket.on("receiveQuestion", (question) => listener(question));
    }

    public async generatePairs(socket: Socket){
        socket.emit("generatePairs")
    }

    public async getPair(socket: Socket, listener: (pair: any) => void){
        socket.on("getPair", (pair) => listener(pair));
    }

    public async sendList(socket: Socket, list: string[], recipient: string){
        socket.emit("sendList", {list: list, recipient: recipient});
    }

    public async receiveList(socket: Socket, listener: (list: any) => void){
        socket.on("receiveList", (list) => listener(list));
    }
}

export default new GameService();