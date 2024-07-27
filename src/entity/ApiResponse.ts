import mongoose, {Schema} from 'mongoose'

const schema = new Schema({
    id: {type: String, required: true},
    type: {type: String, required: true},
    attachment: {type: Object, required: true}
})

const ApiResponse = mongoose.model("ApiResponse", schema)

export default ApiResponse;
