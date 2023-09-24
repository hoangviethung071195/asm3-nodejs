import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as IOServer } from 'socket.io';
import { DefaultEventsMap } from "@socket.io/component-emitter";

let io: IOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
const connectSocket = (httpServer: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  io = new IOServer(httpServer, {
    cors: {}
  });
  return io;
};

export {
  connectSocket,
  io,
};