import ChatRoom from "../entity/ChatRoom";
import ChatMessage from "../entity/ChatMessage";

async function getAllChatRoom(userId: string) {
    try {
        return await ChatRoom.find({userId: userId})
    } catch (error) {
        console.error("[ERROR] Error when #getAllChatRooms:", error)
    }
}

async function getChatHistory(chatRoomIdReq: string) {
    try {
        console.log(chatRoomIdReq)
        return await ChatMessage.find({chatRoomId: chatRoomIdReq})
    } catch (error) {
        console.error("[ERROR] Error when #getChatHistory:", error)
    }
}

const chatService = {
    getAllChatRoom,
    getChatHistory
}

export default chatService