const io = require('socket.io');

let data;

module.exports = {
  connect: (httpServer) => {
    data = io(httpServer, {
      cors: {}
    });
    return data;
  },
  getIO: () => data
};