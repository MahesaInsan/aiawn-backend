export interface ChatRequest{
    user_agent: string,
    thread_id?: string,
    credential: Credential
    message: string,
    location: Location
}

interface Credential{
    name: string,
    phone: string
}

interface Location{
    lat: number,
    lng: number
}