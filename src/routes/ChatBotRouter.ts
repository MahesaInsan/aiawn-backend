import {Router, Request, Response} from "express";

// Swagger Documentation for ChatBotRouter
/**
 * @swagger
 * components:
 *   schemas:
 *     AssistantChatRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: message to be sent to the bot
 */

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat API
 * /api/chat:
 *   get:
 *     summary: swaggerGetSetup
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssistantChatRequest'
 *     responses:
 *       200:
 *         description: chat.
 *         content:
 *           application/json:
 *             {
 *                 "Hello World"
 *             }
 *       500:
 *         description: Some server error
 *
 */

export const chatBotRouter = Router()

chatBotRouter.get("/", (req: Request, res: Response) => {
    res.send("Hello World")
})