import axios from "axios";
import GooglePlacesResponse from "../models/response/GooglePlacesResponse";
import GoogleGeocodingResponse from "../models/response/GoogleGeocodingResponse";
import GoogleReverseGeocodingResponse from "../models/response/GoogleReverseGeocodingResponse";

async function fetchTextSearchResult(textQuery: string){
    try {
        console.log(textQuery)
        return await axios.post(
            "https://places.googleapis.com/v1/places:searchText",
            {
                "pageSize": 5,
                "textQuery": textQuery
            },
            {
                headers:{
                    "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
                    "X-Goog-FieldMask": "places.displayName,places.priceLevel,places.primaryType," +
                        "places.primaryTypeDisplayName,places.id,places.rating,places.userRatingCount,places.photos"
                }
            }).then((response ) => {
                const integratorResponse: GooglePlacesResponse = response.data
                return integratorResponse
            })
    } catch (error) {
        console.error("error calling #fetchPlaceTextQuery: ", error)
    }
}

async function fetchGeocoding(address: string) {
    try {
        const createdURI = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            encodeURI(address) + "&key=" + process.env.GOOGLE_API_KEY
        return await axios.post(createdURI)
            .then((axiosResponse) => {
                const integratorResponse: GoogleGeocodingResponse = axiosResponse.data
                console.log(integratorResponse.results[0].geometry.location)
                return integratorResponse.results[0].geometry.location
            })
    } catch (error) {
        console.error("error calling #fetchGeocoding: ", error)
    }
}

async function fetchReverseGeocoding(latLng: string){
    try {
        const createdURI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            latLng + "&key=" + process.env.GOOGLE_API_KEY
        console.log(createdURI)
        return await axios.post(createdURI)
            .then((axiosResponse ) => {
                const integratorResponse: GoogleReverseGeocodingResponse = axiosResponse.data
                console.log(integratorResponse)
                return integratorResponse;
            })
    } catch (error) {
        console.error("error calling #fetchReverseGeocoding: ", error)
    }
}

const googleApiIntegrators = {
    fetchTextSearchResult,
    fetchGeocoding,
    fetchReverseGeocoding
}

export default googleApiIntegrators