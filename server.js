let webSocket = new WebSocket("ws://localhost:8080");

webSocket.onopen("connection", ws =>{
    console.log("New client connect");
});