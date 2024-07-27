import mongoose, {Schema} from 'mongoose'

const schema = new Schema({
    chatRoomId: {type: Schema.Types.ObjectId, ref: 'chatRoom', required: true},
    role: {type: String, required: true},
    message: {type: String, required: true},
    tool_id: [{type: String, required: false}]
})

const ChatMessage = mongoose.model("ChatMessage", schema)

export default ChatMessage;
