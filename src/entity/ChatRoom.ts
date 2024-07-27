import mongoose, {Schema} from 'mongoose'

const schema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    threadId: {type: String, required: true}
})

const ChatRoom = mongoose.model("ChatRoom", schema)

export default ChatRoom;
