import ChatRoom from "../entity/ChatRoom";
import ChatMessage from "../entity/ChatMessage";

async function initiateChatRoom(userId: string) {
    try {
        const chatRoom = await ChatRoom.create({userId: userId, timestamps: new Date().toISOString(), is_active: true})
        await ChatMessage.create({
            chatRoomId: chatRoom.id,
            role: "assistant",
            message: "Hello what kind of food would you like today?"
        })
        return chatRoom
    } catch (error) {
        console.error("[ERROR] Error when #initiateChatRoom:", error)
    }
}

async function getAllChatRoom(userId: string) {
    try {
        return await ChatRoom.find({userId: userId}).sort({is_active: 'desc', timestamps: 'desc'}).exec()
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

async function finalizeChat(chatRoomIdReq: string){
    try {
        return await ChatRoom.findOneAndUpdate({_id: chatRoomIdReq}, {is_active: false})
    } catch (error) {
        console.error("[ERROR] Error when #finalizingChat", error)
    }
}

const chatService = {
    finalizeChat,
    getAllChatRoom,
    getChatHistory,
    initiateChatRoom
}

export default chatService