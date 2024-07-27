import {OpenAI} from "openai";
import {Thread, Threads} from "openai/resources/beta";
import {ChatRequest} from "../models/request/ChatRequest";
import MessageCreateParams = Threads.MessageCreateParams;
import {Messages} from "openai/resources/beta/threads";
import TextContentBlock = Messages.TextContentBlock;
import googleApiIntegrator from "../integrators/GoogleApiIntegrator";
import ChatRoom from "../entity/ChatRoom";
import chatRoom from "../entity/ChatRoom";
import ChatMessage from "../entity/ChatMessage";
import Attachment from "../entity/Attachment";
import chatMessage from "../entity/ChatMessage";
import PlaceResponseFormatter from "../models/helper/PlaceResponseFormatter";

const openAI = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
let thread: Thread

export default async function assistantChat(request: ChatRequest){
    try {
        let chatRoom;
        console.log("[LOG] Assistant Bot is Called")
        const assistant = await openAI.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID!)
        if (!request.thread_id || !request.chat_room_id) {
            thread = await openAI.beta.threads.create()
            await initChat(thread.id)
            chatRoom = await ChatRoom
                .findOneAndUpdate({_id: request.chat_room_id}, {threadId: thread.id})
        } else {
            thread = await openAI.beta.threads.retrieve(request.thread_id)
        }

        const constructedMessageParam: MessageCreateParams = {
            role: "user",
            content: JSON.stringify({
                message: request.message,
                location: request.location
            })
        }

        await openAI.beta.threads.messages.create(
            thread.id,
            constructedMessageParam
        )

        await ChatMessage.create({
            chatRoomId: chatRoom!.id,
            role: "user",
            message: request.message
        })

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
                    // case 'get_nearby_places':
                    //     await googleApiIntegrator.fetchNearbyPlaces(argument.latitude, argument.longitude)
                    //         .then((apiResponse) => {
                    //             apiResponse?.places.map(place => {
                    //                 Attachment.create({
                    //                     id: place.id,
                    //                     type: "PLACES",
                    //                     data: place
                    //                 })
                    //             })
                    //             tool_outputs.push({
                    //                 tool_call_id: toolCall.id,
                    //                 output: JSON.stringify({
                    //                     apiResponse: apiResponse,
                    //                 })
                    //             })
                    //         })
                    //     break;
                    case 'get_routes':
                        await googleApiIntegrator.fetchRoute(argument.originLatLng, argument.destinationLatLng)
                            .then((apiResponse) => {
                                Attachment.create({
                                    id: toolCall.id,
                                    type: "ROUTES",
                                    data: apiResponse
                                })
                                tool_outputs.push({
                                    tool_call_id: toolCall.id,
                                    output: JSON.stringify({
                                        apiResponse: apiResponse,
                                        tool_call_id: toolCall.id
                                    })
                                })
                            })
                        break;
                    case 'get_text_search':
                        await googleApiIntegrator.fetchTextSearchResult(argument.textQuery)
                            .then((apiResponse) => {
                                const formattedResponse = PlaceResponseFormatter(apiResponse!)
                                formattedResponse.places.map(place => {
                                    console.log(place)
                                    Attachment.create({
                                        id: place.placeId,
                                        type: "PLACES",
                                        data: place
                                    })
                                })
                                tool_outputs.push({
                                    tool_call_id: toolCall.id,
                                    output: JSON.stringify({
                                        apiResponse: apiResponse,
                                    })
                                })
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
            console.log(JSON.parse(content.text.value))
            await chatMessage.create({
                chatRoomId: chatRoom!.id,
                role: "assistant",
                message: JSON.parse(content.text.value).message,
                attachment: JSON.parse(content.text.value).places
            })
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

async function initChat(threadId: string) {
    await openAI.beta.threads.messages.create(
        threadId,
        {
            "role": "user",
            "content": JSON.stringify({
                "prompt": "I want spicy food",
                "location": {
                    "lat": -6.294797550790062,
                    "lng": 106.78541623142699
                },
                "user_agent": "iPhone 15 Pro"
            })
        }
    )
    await openAI.beta.threads.messages.create(
        threadId,
        {
            "role": "assistant",
            "content": JSON.stringify({
                "success": "true",
                "reasoning": "First, I will use get_reverse_geocoding to convert user location into readable address. Next, I will find spicy food restaurants within the radius of that location using get_text_search. The function returns 20 top places, but I have filtered them to match user's preference which is spicy food. Then I return the places ID in for of array to be consumed by front-end.",
                "message": "Here are some spicy food I found near your location.",
                "places": [
                    "ChIJL0KotdvxaS4RdV_kostfVrQ",
                    "ChIJOZxMaK3laS4RJtPTRzJ8drk",
                    "ChIJbzbB1-XxaS4R4T6I5BHOzOQ",
                    "ChIJa6KdSZ3xaS4RpyyTndMGVs8"
                ],
                "next_action": [
                    "Search for Indonesian food",
                    "Search for food below Rp 50k"
                ]
            })
        }
    )
    await openAI.beta.threads.messages.create(
        threadId,
        {
            "role": "user",
            "content": JSON.stringify({
                "prompt": "What's 1 + 1?",
                "location": {
                    "lat": -6.294797550790062,
                    "lng": 106.78541623142699
                },
                "user_agent": "iPhone 15 Pro"
            })
        }
    )
    await openAI.beta.threads.messages.create(
        threadId,
        {
            "role": "assistant",
            "content": JSON.stringify({
                "success": "false",
                "reasoning": "User requests outside of the service scope. I rejected the request.",
                "message": "I'm sorry but we are unable to answer your question. If you have inquiry to search for a specific food, I'm here!",
                "next_action": [
                    "Search for food below Rp 50k",
                    "What food do you recommend?"
                ]
            })
        }
    )
}