import { ChatRoom } from '../models/chat-room';
import { processResponse } from '../middleware/handler/promise-controller';
import { io } from '../../socket';
import { MiddlewareModel } from '../util/models/controller';

export const sendMessage: MiddlewareModel = (req, res, next) => {
  console.log('sendMessage ');
  const { customerId, message } = req.body;

  processResponse(req, res, next,
    ChatRoom.findOne({ customerId }),
    (room: any) => {
      if (room) {
        room.message.push(message);
        room.save();
      } else {
        const newRoom = new ChatRoom({
          customerId: (customerId),
          message: [message]
        });
        newRoom.save();
      }
      io.emit('to_employee', room);
      io.emit('to_customer', room);
      res.send(true);
    }
  );
};

export const getChatRoom: MiddlewareModel = (req, res, next) => {
  console.log('getChatRoom');
  const { customerId } = req.params;

  processResponse(req, res, next,
    ChatRoom.findOne({ customerId })
  );
};

export const getChatRooms: MiddlewareModel = (req, res, next) => {
  processResponse(req, res, next,
    ChatRoom.find()
  );
};

export const deleteChatRoom: MiddlewareModel = (req, res, next) => {
  console.log('deleteChatRoom');
  const { id } = req.params;

  processResponse(req, res, next,
    ChatRoom.findByIdAndDelete(id),
    (r) => {
      io.emit('delete_room', id);
      res.send(r);
    }
  );
};