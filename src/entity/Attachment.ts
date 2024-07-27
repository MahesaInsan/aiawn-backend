import mongoose, {Schema} from 'mongoose'

const schema = new Schema({
    id: {type: String, required: true},
    type: {type: String, required: true},
    data: {type: Object, required: true}
})

const Attachment = mongoose.model("Attachment", schema)

export default Attachment;
