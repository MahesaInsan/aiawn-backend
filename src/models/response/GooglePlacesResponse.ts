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
        rating: number;
        userRatingCount: number;
        photos?: {
            authorAttributions?: {
                uri: string;
            }[]
        }[]
        id: string;
    }[]
}