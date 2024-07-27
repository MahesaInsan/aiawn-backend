import Attachment from "../entity/Attachment";

export default async function getAllAttachment(request: string[]) {
    try {
        return Attachment.find({id: {"$in": [...request]}}).exec()
    } catch (error) {
        console.error("[ERROR] when #getAllAttachment:", error)
    }
}