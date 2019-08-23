module.exports.socketServer = (http) => {
    
    const io = require('socket.io')(http);
    var activeUsers = [],
        activeSocketId = [];

    io.on('connection', (socket) => {
        // console.log(socket.id);
        // console.log(io.sockets.adapter.rooms);

        socket.on('new user', function(data){

            /**
             * Enlisting user as online/active
             */
            let tempUsers = activeUsers.map(val => val.rooms);

            if(tempUsers.indexOf(data) === -1){
                socket.join(data);
                activeUsers.push( {rooms: data, sockets: socket.id} );
            }

        });

        socket.on('disconnect', function(){
            /**
             * deactivating online user from activated user list
             */
            let sockets = activeUsers.map(val => val.sockets);
            
            delete activeUsers[ sockets.findIndex((val) => { return (val == socket.id) } ) ];

        });

        socket.on('send message', (data) => {
            io.sockets.to(data.toUser).emit('message', data.msg);
        });

    });

}