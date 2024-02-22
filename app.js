if(process.env.NODE_ENV!=='production'){
  require ("dotenv").config()
}
const express = require("express");
const port = process.env.port || 3000
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "http://localhost:5173"
  }
 });

 let arr = [];
 
 io.on('connection', (socket) => {
  console.log('new connection');
  let user = socket.handshake.auth.username 
    console.log('new connect '+socket.handshake.auth.username);

    // klo ada user login
    if (user) {
      arr.push({user});
      // console.log(arr,'<- arr user');

      // klo yg login sudah 2 user
      if (arr.length === 2) {
        console.log('2 user telah login');
        arr[0].symbol = 'X'

        arr[1].symbol = 'O'
        console.log(arr,'<-user yg login di server');
        io.emit('find', arr);
        arr.splice(0, 2);
      }
    }

   socket.on('playing', (e) => { //<<< 3 diterima click
    io.emit('playing', e) // <<< 4 kirim ke client
   });
 
   socket.on('gameOver', (e)=>{
    io.emit('gameOver', e)
   })

   socket.on('username',(e)=>{
    io.emit('username', e)
   })

   
 });

httpServer.listen(port,()=> console.log(`listen on porrt ${port}`));