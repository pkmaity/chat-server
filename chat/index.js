module.exports.socketServer = (http) => {
    
    const io = require('socket.io')(http);
    var activeUsers = [];

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

            socket.broadcast.emit('new active user', activeUsers.map(val => val.rooms));

        });

        socket.on('disconnect', function(){
            /**
             * List of Sockets
             */
            let sockets = activeUsers.map(val => val.sockets);

            /**
             * List of Users
             */
            let users = activeUsers.map(val => val.rooms);

            /**
             * Sending other users that one user is offline
             */
            socket.broadcast.emit('offline user', users[ activeUsers.findIndex((val) => { return (val.sockets == socket.id) } ) ] );

            /**
             * Deactivating online user from activated user list
             */
            activeUsers.splice(sockets.findIndex((val) => { return (val == socket.id) } ), 1 );
            
        });

        socket.on('disconnect user', (data) => {

            /**
             * List of Users
             */
            let users = activeUsers.map(val => val.rooms);

            /**
             * Sending other users that one user is offline
             */
            socket.broadcast.emit('offline user', users[ activeUsers.findIndex((val) => { return (val.rooms === data) } ) ] );

            /**
             * Deactivating online user from activated user list
             */
            activeUsers.splice(users.findIndex((val) => { return (val === data) } ), 1 );

        });

        socket.on('online users', () => {
            socket.emit('new active user', activeUsers.map(val => val.rooms));
        });

        socket.on('send message', (data) => {
            io.sockets.to(data.toUser).emit('message', data.msg);
        });

    });

}