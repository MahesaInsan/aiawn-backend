import GooglePlacesResponse from "../response/GooglePlacesResponse";
import FormattedPlaceResponse from "../response/FormattedPlaceResponse";

const PlaceResponseFormatter = (placesResponse: GooglePlacesResponse) =>{
    let formattedPlaceResponse: FormattedPlaceResponse;
    placesResponse.places.map((place) => {
        formattedPlaceResponse.places.push(
            {
                placeId: place.id,
                priceLevel: place.priceLevel,
                rating: place.rating,
                userRatingCount: place.userRatingCount,
                primaryType: place.primaryTypeDisplayName.text,
                photosUri: place?.photos?.[0]?.authorAttributions?.[0].uri ?? ""
            }
        )
    })
    return formattedPlaceResponse
}

export default PlaceResponseFormatter