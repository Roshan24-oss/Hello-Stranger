import http from 'http';
import {Server} from 'socket.io';
import {v4 as uuid} from "uuid"
import dotenv from 'dotenv';
dotenv.config();
const server=http.createServer();
const port = process.env.PORT || 8000;

const io=new Server(server,{cors:{origin:'*'}});
const waitingQueue=[]
const activePairs=new Map()
io.on('connection', (socket)=>{
    console.log(socket.id)
    if(waitingQueue.includes(socket.id))return
    socket.on("start", ()=>{
        if(waitingQueue.length>0){
            const partner=waitingQueue.shift()
            const roomId=uuid()
            activePairs.set(socket.id,partner)
            activePairs.set(partner,socket.id)
            socket.emit("matched",(roomId))
            socket.to(partner).emit("matched",{roomId})
        }else{
            waitingQueue.push(socket.id)
        }
    })
})

server.listen(port,()=>{
    console.log("Server is running on port",port);
});