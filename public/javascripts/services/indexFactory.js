app.factory('indexFactory', [ () => {
    const connectSocket = (url, options) => new Promise((resolve, reject) => {
        const socket = io.connect(url, options);

        socket.on('connect', () => {
            resolve(socket);
        });

        socket.on('connect_error', () => {
            reject(new Error('connect_error'));
        });
    });

    return {
        connectSocket,
    };
} ]);
