# AIAWN - Attention Is All We Need BACKEND

### Service Main Function

- As a communication bridge for OpenAI and our frontend
- As an api integrator for Google API with our frontend
- Save chat's data to database to be fetched and consumed by frontend

### Used Library

- Axios
- Cors
- Dotenv
- Nodemon
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

#### /api/chat/_submit

- Description:
```txt
Send chat to GRABesk bot
```

- Method:
```json
POST
```
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

<br />

#### /api/chat/:roomId/history 

- Description:
```txt
Get user's chat details history
```

- Method:
```json
GET
```

- Path Variable:
```json
roomId
```

- Request Body:
```json
-
```

<br />

#### /api/chat/summary

- Description:
```txt
Get list of user's chat
```

- Method:
```json
POST 
```

- Request Body:
```json
{
  "user_id": "string"
}
```

<br />

#### /api/chat/chatroom

- Description:
```txt
Initiate new chat room
```

- Method:
```json
POST 
```

- Request Body:
```json
{
  "user_id": "string"
}
```

<br />

#### /api/chat/_finalize

- Description:
```txt
Finalize chat room
```

- Method:
```json
POST
```

- Request Body:
```json
{
  "chat_room_id": "string"
}
```

<br />
<br />

### User Router
#### /api/users/_login

- Description:
```txt
Endpoint for user to log in
```

- Method:
```json
POST
```

- Request Body:
```json
{
  "phone": "string"
}
```

<br />

#### /api/users/_register

- Description:
```txt
Endpoint for user to register
```

- Method:
```json
POST
```

- Request Body:

```json
{
  "name": "string",
  "phone": "string"
}
```

<br />
<br />

### Attachment Router
#### /api/attachments

- Description:
```txt
Fetch all attachment
```

- Method:
```json
POST
```

- Request Body:
```json
{
  "attachments": [
    "string",
    "string"
  ]
}
```