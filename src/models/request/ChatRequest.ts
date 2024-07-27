export interface ChatRequest{
    user_agent: string,
    thread_id?: string,
    chat_room_id?: string,
    user_id: string,
    message: string,
    location: Location
}

interface Location{
    lat: number,
    lng: number
}