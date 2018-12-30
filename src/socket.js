import openSocket from 'socket.io-client';

function subscribeToMessage(socketUrl, cb) {
  const socket = openSocket(socketUrl)
  socket.on('message', function (data) {
    console.log(data);
    cb(null, data);
  })
}

export { subscribeToMessage }
