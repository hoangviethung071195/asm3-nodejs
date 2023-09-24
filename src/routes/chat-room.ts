import { Router } from 'express';
import { getChatRooms, getChatRoom, deleteChatRoom, sendMessage } from '../controllers/chat-room';
import { isAuthenticated } from '../middleware/validation/auth/authentication';
import { CHAT_ROOM_PATH, PLURAL, DYNAMIC_ID_ROUTE } from '../util/constant/routes';
const router = Router();

router.get(CHAT_ROOM_PATH + PLURAL,
  isAuthenticated,
  getChatRooms
);

router.get(CHAT_ROOM_PATH + DYNAMIC_ID_ROUTE,
  isAuthenticated,
  getChatRoom
);

router.delete(CHAT_ROOM_PATH + DYNAMIC_ID_ROUTE,
  isAuthenticated,
  deleteChatRoom
);

router.post(CHAT_ROOM_PATH + '/message',
  isAuthenticated,
  sendMessage
);

export const chatRoomRoutes = router;