import {Router, Request, Response} from "express";
import assistantChat from "../service/JarvisAlpha";
import getAllAttachment from "../service/AttachmentService";

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

export const attachmentRouter = Router()

attachmentRouter.post("/", async (req: Request, res: Response) => {
    const request: string[] = req.body.attachments
    res.send(await getAllAttachment(request))
})