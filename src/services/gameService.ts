import {Socket} from 'socket.io-client';

class GameService {
    public async createRoom(socket: Socket, name: string): Promise<boolean> {
        return new Promise((rs) => {
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
        socket.on("updateRoom", (r) => listener(r));
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

    public async addListItems(socket: Socket, list: string[]){
        socket.emit("addListItems", {houseItems: list})
    }

    public async getPlayersReady(socket: Socket, listener: (num: number) => void){
        socket.on("playerReady", (num) => listener(num.data))
    }

    public async appendListToQuestions(socket: Socket){
        socket.emit("appendListToQuestions");
    }

    public async setQuestionList(socket: Socket, listener: (data: any) => void){
        socket.on("setQuestionList", (data) => listener(data));
    }

    public async getOrder(socket: Socket){
        socket.emit("getOrder");
    }

    public async generateOrder(socket: Socket, listener: (order: any) => void){
        socket.on("generateOrder", (order) => listener(order));
    }
}

export default new GameService();