import {OpenAI} from "openai";
import {Thread, Threads} from "openai/resources/beta";
import {ChatRequest} from "../models/request/ChatRequest";
import MessageCreateParams = Threads.MessageCreateParams;
import {Messages} from "openai/resources/beta/threads";
import TextContentBlock = Messages.TextContentBlock;
import googleApiIntegrator from "../integrators/GoogleApiIntegrator";

const openAI = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
let thread: Thread

export default async function assistantChat(request: ChatRequest){
    try {
        let loggedToolCall: string[] = []

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
                message: request
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

        while(run.status != "completed") {
            let tool_outputs: {
                tool_call_id: string,
                output?: string
            }[] = []

            for (const toolCall of run.required_action?.submit_tool_outputs.tool_calls || []) {
                console.log("[LOG] #toolCalled: ", toolCall.function.name)
                const argument = JSON.parse(toolCall.function.arguments)
                console.log("[LOG] Argument:", argument)

                switch (toolCall.function.name) {
                    case 'get_nearby_places':
                        await googleApiIntegrator.fetchNearbyPlaces(argument.latitude, argument.longitude)
                            .then((apiResponse) => {
                                tool_outputs.push({
                                    tool_call_id: toolCall.id,
                                    output: JSON.stringify({
                                        apiResponse: apiResponse,
                                    })
                                })
                                loggedToolCall.push(toolCall.id)
                            })
                        break;
                    case 'get_routes':
                        await googleApiIntegrator.fetchRoute(argument.originLatLng, argument.destinationLatLng)
                            .then((apiResponse) => {
                                tool_outputs.push({
                                    tool_call_id: toolCall.id,
                                    output: JSON.stringify({
                                        apiResponse: apiResponse,
                                        tool_call_id: toolCall.id
                                    })
                                })
                                loggedToolCall.push(toolCall.id)
                            })
                        break;
                    case 'get_text_search':
                        await googleApiIntegrator.fetchTextSearchResult(argument.textQuery)
                            .then((apiResponse) => {
                                tool_outputs.push({
                                    tool_call_id: toolCall.id,
                                    output: JSON.stringify({
                                        apiResponse: apiResponse,
                                    })
                                })
                                loggedToolCall.push(toolCall.id)
                            })
                        break;
                    case 'get_geocoding':
                        await googleApiIntegrator.fetchGeocoding(argument.address)
                            .then((apiResponse) => {
                                tool_outputs.push({
                                    tool_call_id: toolCall.id,
                                    output: JSON.stringify({
                                        apiResponse: apiResponse,
                                        tool_call_id: toolCall.id
                                    })
                                })
                            })
                        break;
                    case 'get_reverse_geocoding':
                        await googleApiIntegrator.fetchReverseGeocoding(argument.latlng)
                            .then((apiResponse) => {
                                tool_outputs.push({
                                    tool_call_id: toolCall.id,
                                    output: JSON.stringify({
                                        apiResponse: apiResponse,
                                        tool_call_id: toolCall.id
                                    })
                                })
                            })
                        break;
                }
            }

            if (tool_outputs.length > 0){
                try {
                    run = await openAI.beta.threads.runs.submitToolOutputsAndPoll(
                        thread.id,
                        run.id,
                        {
                            tool_outputs: tool_outputs,
                        }
                    )
                } catch (error) {
                    console.error("[ERROR] when #sendingToolCallResponse: ", error)
                }
            }
        }

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