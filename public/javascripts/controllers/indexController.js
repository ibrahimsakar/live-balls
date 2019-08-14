app.controller('indexController', [ '$scope', 'indexFactory', ($scope, indexFactory) => {
    $scope.messages = [];
    $scope.players = {};

    $scope.init = () => {
        const username = prompt('Please  enter username');

        if (username) { initSocket(username); }
        else { return false; }
    };

    scrollDown = () => {
        setTimeout(() => {
            const element = document.getElementById('chat-area');

            element.scrollTop = element.scrollHeight;
        });
    };

    showBubble = (id, message) => {
        $(`#${id}`).find('.message').show().html(message);

        setTimeout(() => {
            $(`#${id}`).find('.message').hide();
        }, 2000);
    };

    async function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600,
        };

        try {
            const socket = await indexFactory.connectSocket('http://localhost:3000', connectionOptions);

            socket.emit('newUser', { username });

            socket.on('initPlayers', (players) => {
                $scope.players = players;
                $scope.$apply();
            });

            socket.on('newUser', (data) => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 1,
                    },
                    username: data.username,
                };

                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                scrollDown();
                $scope.$apply();
            });

            socket.on('disUser', (data) => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 0,
                    }, // info
                    username: data.username,
                };

                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                scrollTop();
                $scope.$apply();
            });

            socket.on('animate', (data) => {
                $(`#${data.socketId}`).animate({ 'left': data.x, 'top': data.y }, () => {
                    animate = false;
                });
            });

            socket.on('newMessage', (message) => {
                $scope.messages.push(message);
                $scope.$apply();
                showBubble(message.socketId, message.text);
                scrollDown();
            });

            let animate = false;

            $scope.onClickPlayer = ($event) => {
                if (!animate) {
                    const x = $event.offsetX;
                    const y = $event.offsetY;

                    socket.emit('animate', { x, y });
                    animate = true;
                    $(`#${socket.id}`).animate({ 'left': $event.offsetX, 'top': $event.offsetY }, () => {
                        animate = false;
                    });
                }
            };

            $scope.newMessage = () => {
                const message = $scope.message;

                const messageData = {
                    type: {
                        code: 1,
                    },
                    username: username,
                    text: message,
                };

                $scope.messages.push(messageData);
                $scope.message = '';

                socket.emit('newMessage', messageData);
                showBubble(socket.id, message);
                scrollDown();
            };
        }
        catch (err) {
            console.log(err);
        }
    }
} ]);
