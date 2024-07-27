import express, {Express, Request, Response} from "express";
import cors from "cors"
import "dotenv/config"
import {chatBotRouter} from "./routes/ChatBotRouter";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

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

app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs))
app.use(express.json())
app.use(cors())

app.use("/api/chat", chatBotRouter);

app.listen(port, () => {
    console.log("[SERVER] Server running port:", port)
})

