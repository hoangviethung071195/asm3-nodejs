import { ChatRoom } from '../models/chat-room';
import { processResponse } from '../middleware/handler/promise-controller';
import { io } from '../../socket';
import { MiddlewareModel } from '../util/models/middleware.model';

export const sendMessage: MiddlewareModel = (req, res, next) => {
  console.log('sendMessage ');
  const { customerId, message } = req.body;
  message[0].createdAt = Date.now();
  processResponse<InstanceType<typeof ChatRoom>>(req, res, next,
    ChatRoom.findOne({ customerId }),
    async (room) => {
      let updateRoom = null;
      if (room) {
        room.message.push(message[0]);
        updateRoom = await room.save();
      } else {
        const newRoom = new ChatRoom({
          customerId: (customerId),
          message: message
        });
        updateRoom = await newRoom.save();
      }
      console.log('room ', updateRoom);
      io.emit('to_employee', updateRoom);
      io.emit('to_customer', updateRoom);
      res.json(updateRoom);
    }
  );
};

export const getChatRoom: MiddlewareModel = (req, res, next) => {
  console.log('getChatRoom');
  const { id } = req.params;

  processResponse(req, res, next,
    ChatRoom.findById(id)
  );
};

export const getChatRoomByUser: MiddlewareModel = (req, res, next) => {
  console.log('getChatRoomByUser');
  const { customerId } = req.body;
  console.log('customerId ', customerId);
  processResponse(req, res, next,
    ChatRoom.findOne({ customerId })
  );
};

export const getChatRooms: MiddlewareModel = (req, res, next) => {
  console.log('getChatRooms');
  processResponse(req, res, next,
    ChatRoom.find()
  );
};

export const deleteChatRoom: MiddlewareModel = (req, res, next) => {
  console.log('deleteChatRoom');
  const { id } = req.params;
  console.log('id ', id);
  processResponse(req, res, next,
    ChatRoom.findByIdAndDelete(id),
    (r) => {
      io.emit('delete_room', id);
      res.json(r);
    }
  );
};