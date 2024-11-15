const { Server } = require('socket.io');

let io;

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3001', // Adjust this based on your frontend URL
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('New user connected:', socket.id);

        // Listen for a new vote event
        socket.on('newVote', (data) => {
            console.log('New vote received:', data);

            // Emit the updated vote count to all connected clients
            io.emit('updateVoteCount', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

// Export the initialized Socket.IO instance and function
module.exports = { initializeSocket, getIO: () => io };
