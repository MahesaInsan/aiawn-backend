import {Router, Request, Response} from "express";
import {ChatRequest} from "../models/request/ChatRequest";
import assistantChat from "../service/JarvisAlpha";
import LoginRequest from "../models/request/LoginRequest";
import RegisterRequest from "../models/request/RegisterRequest";
import authService from "../service/AuthService";

// Swagger Documentation for ChatBotRouter
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: user's name
 *         phone:
 *           type: string
 *           description: user's phone number
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - phone
 *       properties:
 *         phone:
 *           type: number
 *           description: user's phone number
 *
 *     RegisterResponse:
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
 *
 * /api/users/_login:
 *   post:
 *     summary: login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Some server error
 *
 * /api/users/_register:
 *   post:
 *     summary: register
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Some server error
 */

export const userRouter = Router()

userRouter.post("/_login", async (req: Request, res: Response) => {
    const request: LoginRequest = req.body
    const user = await authService.login(request)
    if (user) {
        res.send({
            code: 200,
            status: "OK",
            data: user
        })
    } else {
        res.send({
            code: 400,
            status: "BAD_REQUEST",
            data: false
        })
    }
})

userRouter.post("/_register", async (req: Request, res: Response) => {
    const request: RegisterRequest = req.body
    const user = await authService.register(request)
    if (user) {
        res.send({
            code: 200,
            status: "OK",
            data: user
        })
    } else {
        res.send({
            code: 400,
            status: "BAD_REQUEST",
            data: false
        })
    }
})