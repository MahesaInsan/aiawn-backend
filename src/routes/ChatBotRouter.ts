import {Router, Request, Response} from "express";
import {ChatRequest} from "../models/request/ChatRequest";
import assistantChat from "../service/JarvisAlpha";

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
 *           description: existing thread id
 *         thread_id:
 *           type: string
 *           description: existing thread id
 *         credential:
 *           type: object
 *           $ref: '#/components/schemas/Credential'
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
 *     Credential:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: user's name
 *         phone:
 *           type: string
 *           description: user's string
 *
 *     ChatResponse:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: number
 *           description: timestamp in epoch
 *         thread_id:
 *           type: string
 *           description: chat's thread id
 *         message:
 *           type: object
 *           $ref: '#/components/schemas/Message'
 *         call_id:
 *           type: array
 *           description: call id string
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
 * /api/chat:
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
 */

export const chatBotRouter = Router()

chatBotRouter.post("/", async (req: Request, res: Response) => {
    const request: ChatRequest = req.body
    res.send(await assistantChat(request))
})