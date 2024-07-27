import {OpenAI} from "openai";
import {Thread, Threads} from "openai/resources/beta";
import {ChatRequest} from "../models/ChatRequest";
import MessageCreateParams = Threads.MessageCreateParams;
import {Messages} from "openai/resources/beta/threads";
import TextContentBlock = Messages.TextContentBlock;

const openAI = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
let thread: Thread

export default async function assistantChat(request: ChatRequest){
    try {
        console.log("[LOG] Assistant Bot is Called")
        const assistant = await openAI.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID!)
        if (!request.thread_id) {
            thread = await openAI.beta.threads.create()
        } else {
            thread = await openAI.beta.threads.retrieve(request.thread_id)
        }

        const constructedMessageParam: MessageCreateParams = {
            role: "user",
            content: JSON.stringify({
                message: request.message
            })
        }

        await openAI.beta.threads.messages.create(
            thread.id,
            constructedMessageParam
        )

        let run = await openAI.beta.threads.runs.createAndPoll(
            thread.id,
            {
                assistant_id: assistant.id
            }
        )

        if (run.status == "completed") {
            const messages = await openAI.beta.threads.messages.list(thread.id)
            const content = messages.data[0].content[0] as TextContentBlock
            return {
                code: 200,
                status: "OK",
                data: JSON.parse(content.text.value)
            }
        }
    } catch (error) {
        console.error("[ERROR] Error when #callingAssistantChat: ", error)
    }
}