export default interface GoogleGeocodingResponse{
    results: {
        geometry: {
            location: {
                lat: number,
                lng: number
            }
        }
    }[]
}