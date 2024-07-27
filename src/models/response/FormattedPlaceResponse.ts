export default interface FormattedPlaceResponse{
    places: {
        placeId: string,
        priceLevel?: string,
        rating: number,
        userRatingCount: number,
        primaryType: string,
        photosUri: string
    }[]
}