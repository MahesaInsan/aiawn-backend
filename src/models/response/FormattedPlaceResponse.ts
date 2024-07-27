export default interface FormattedPlaceResponse{
    places: {
        placeId: string,
        placeName: string,
        priceLevel?: string,
        rating: number,
        userRatingCount: number,
        primaryType: string,
        photosUri: string
    }[]
}