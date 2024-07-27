import axios from "axios";
import GooglePlacesResponse from "../models/response/GooglePlacesResponse";
import GoogleRouteResponse from "../models/response/GoogleRouteResponse";
import GoogleGeocodingResponse from "../models/response/GoogleGeocodingResponse";
import GoogleReverseGeocodingResponse from "../models/response/GoogleReverseGeocodingResponse";
import routeResponseFormatter from "../models/helper/RouteResponseFormatter";

async function fetchNearbyPlaces(lat: number, lng: number){
    try {
        console.log(lat, lng)
        return await axios.post(
            "https://places.googleapis.com/v1/places:searchNearby",
            {
                "includedTypes": ["restaurant", "cafe"],
                "excludedTypes": ["hotel", "shopping_mall"],
                "maxResultCount": 20,
                "locationRestriction": {
                    "circle": {
                        "center": {
                            "latitude": lat,
                            "longitude": lng
                        },
                        "radius":5000.0
                    }
                }
            },
            {
                headers: {
                    "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
                    "X-Goog-FieldMask": "places.displayName,places.priceLevel,places.id"
                }
            }).then((axiosResponse) => {
                const integratorResponse: GooglePlacesResponse = axiosResponse.data
                console.log(integratorResponse)
                return integratorResponse
            })
    } catch (error) {
        console.error("error calling #fetchNearbyPlaces: ", error)
    }
}

async function fetchRoute(originLatLng: string, destinationLatLng: string){
    try {
        const origin = originLatLng.split(',');
        const destination = destinationLatLng.split(',')
        console.log(Number.parseFloat(origin[0]), Number.parseFloat(origin[1]))
        return await axios.post(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            {
                "origin": {
                    "location": {
                        "latLng": {
                            "latitude": Number.parseFloat(origin[0]),
                            "longitude":  Number.parseFloat(origin[1])
                        }
                    }
                },
                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": Number.parseFloat(destination[0]),
                            "longitude":  Number.parseFloat(destination[1])
                        }
                    }
                },
                "travelMode": 'TRANSIT',
                "computeAlternativeRoutes": false,
                "languageCode": 'en-US',
                "units": 'METRIC'
            },
            {
                headers:{
                    "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
                    "X-Goog-FieldMask": "routes.legs.steps,routes.legs.stepsOverview,routes.polyline,routes.travelAdvisory,routes.localizedValues"
                }
            }).then((axiosResponse) => {
                const integratorResponse: GoogleRouteResponse = axiosResponse.data
                console.log(integratorResponse)
                const formattedRouteResponse = routeResponseFormatter(integratorResponse)
                console.log(formattedRouteResponse)
                return formattedRouteResponse
            })
    } catch (error) {
        console.error("error calling #fetchRoute: ", error)
    }
}

async function fetchTextSearchResult(textQuery: string){
    try {
        console.log(textQuery)
        return await axios.post(
            "https://places.googleapis.com/v1/places:searchText",
            {
                "textQuery": textQuery
            },
            {
                headers:{
                    "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
                    "X-Goog-FieldMask": "places.displayName,places.priceLevel,places.id"
                }
            }).then((response ) => {
                const integratorResponse: GooglePlacesResponse = response.data
                console.log(integratorResponse)
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
    fetchNearbyPlaces,
    fetchRoute,
    fetchTextSearchResult,
    fetchGeocoding,
    fetchReverseGeocoding
}

export default googleApiIntegrators