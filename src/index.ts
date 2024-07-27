import express, {Express, Request, Response} from "express";
import cors from "cors"
import "dotenv/config"
import {chatRouter} from "./routes/ChatBotRouter";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import mongoose, {mongo} from "mongoose";
import authService from "./service/AuthService";
import {userRouter} from "./routes/UserRouter";
import attachment from "./entity/Attachment";
import {attachmentRouter} from "./routes/AttachmentRouter";

const app: Express = express();
const port = process.env.PORT || 8000;

// Swagger Initialized
const options ={
    definition: {
        openapi: "3.1.0",
        info: {
            title: "AIAWN Backend Express Documentation",
            version: "1.0.0",
            description: "API Specification and Documentation for AIAWN"
        },
        servers: [
            {
                url: "http://localhost:8000"
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
}
const specs = swaggerJsdoc(options);

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URI || "").then(r => console.log("[SERVER] MongoDB are Connected"))
mongoose.connection.on('error', (error) => console.error("[ERROR] Error Connecting MongoDB"))

app.get('/healthcheck', (req, res) => {
    return res.json({message: "Success"}).status(200);
})

app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs))
app.use(express.json())
app.use(cors())

app.use("/api/chat", chatRouter);
app.use("/api/users", userRouter);
app.use("/api/attachments", attachmentRouter)

app.listen(port, () => {
    console.log("[SERVER] Server running port:", port)
})

