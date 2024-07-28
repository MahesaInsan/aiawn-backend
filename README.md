# AIAWN - Attention Is All We Need BACKEND

### Service Main Function

- As a communication bridge for OpenAI and our frontend
- As an api integrator for Google API with our frontend
- Save chat's data to database to be fetched and consumed by frontend

### Used Library

- Axios
- Cors
- Dotenv
- Express
- Mongodb
- Mongoose
- Openai
- Swagger-jsdoc 
- Swagger-ui-express
- Uuid

### How To Run
```console
npm run dev
```

## Router

### Chat Router

##### POST /api/chat/_submit
- Request Body:

```json
{
  "user_agent": "string",
  "thread_id": "string",
  "chat_room_id": "string",
  "user_id": "string",
  "message": "string",
  "location": {
    "lat": 0,
    "lng": 0
  }
}
```

##### GET /api/chat/:roomId/history
- Path Variable:
```json
roomId
```

- Request Body:
```json
-
```


##### POST /api/chat/summary
- Request Body:
```json
{
  "user_id": "string"
}
```

#### POST 