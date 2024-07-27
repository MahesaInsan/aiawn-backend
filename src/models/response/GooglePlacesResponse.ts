export default interface GooglePlacesResponse{
    places: {
        priceLevel?: string,
        displayName: {
            text: string
        },
        primaryTypeDisplayName: {
            text: string
        },
        primaryType?: string;
        id: string;
    }[]
}