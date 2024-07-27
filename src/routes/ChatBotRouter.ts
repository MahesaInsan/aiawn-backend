import {Router, Request, Response} from "express";
import {ChatRequest} from "../models/request/ChatRequest";
import assistantChat from "../service/JarvisAlpha";
import chatService from "../service/ChatService";

// Swagger Documentation for ChatBotRouter
/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         user_agent:
 *           type: string
 *           description: user's device
 *         thread_id:
 *           type: string
 *           description: existing thread id
 *         user_id:
 *           type: string
 *           description: user's id
 *         message:
 *           type: string
 *           description: message to be sent to the bot
 *         location:
 *           type: object
 *           $ref: '#/components/schemas/Location'
 *
 *     Location:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *           description: latitude of the user's location
 *         lng:
 *           type: number
 *           description: longitude of the user's location
 *
 *     ChatSummaryRequest:
 *       type: object
 *       required:
 *         - user_id
 *       properties:
 *         user_id:
 *           type: string
 *           description: user's id
 *
 *     ChatHistoryRequest:
 *       type: object
 *       required:
 *         - room_id
 *       properties:
 *         room_id:
 *           type: string
 *           description: room's id
 *
 *     Message:
 *       type: object
 *       properties:
 *         role:
 *           type: string
 *           description: agent's role
 *         content:
 *           type: string
 *           description: message that were generated
 */

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat API
 * /api/chat/_submit:
 *   post:
 *     summary: send chat to assistant
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       500:
 *         description: Some server error
 *
 * /api/chat/{roomId}/history:
 *   get:
 *     summary: get chat history
 *     tags: [Chat]
 *     parameters:
 *     - in: path
 *       name: roomId
 *       description: Room ID
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       500:
 *         description: Some server error
 *
 * /api/chat/summary:
 *   post:
 *     summary: get chat summary
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatSummaryRequest'
 *     responses:
 *       200:
 *         description: chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       500:
 *         description: Some server error
 *
 */

export const chatRouter = Router()

chatRouter.post("/_submit", async (req: Request, res: Response) => {
    console.log(req)
    const request: ChatRequest = req.body
    res.send(await assistantChat(request))
})

chatRouter.get("/:roomId/history", async (req: Request, res: Response) => {
    const chatRoomId: string = req.params["roomId"]
    res.send(await chatService.getChatHistory(chatRoomId))
})

chatRouter.post("/summary", async (req: Request, res: Response) => {
    const userId: string = req.body.user_id;
    res.send(await chatService.getAllChatRoom(userId))
})

chatRouter.post("/chatroom", async (req: Request, res: Response) => {
    const userId: string = req.body.user_id;
    try {
        res.status(200).send(await chatService.initiateChatRoom(userId))
    } catch {
        res.status(400).send("ERROR")
    }
})

chatRouter.post("/_finalize", async (req: Request, res: Response) => {
    const chatRoomId: string = req.body.chat_room_id;
    try {
        res.status(200).send(await chatService.finalizeChat(chatRoomId))
    } catch {
        res.status(400).send("ERROR")
    }
})
