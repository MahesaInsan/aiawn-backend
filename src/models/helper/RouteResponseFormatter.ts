import GoogleRouteResponse from "../response/GoogleRouteResponse";
const routeResponseFormater = (routeResponse: GoogleRouteResponse) => {
    const stepParent =
        routeResponse.routes[0].legs[0].stepsOverview.multiModalSegments;
    const grabOptions: {
        startLocation: {
            latLng: {
                latitude: number,
                longitude: number
            }
        },
        endLocation: {
            latLng: {
                latitude: number,
                longitude: number
            }
        },
        grabFare: number
    }[] = []

    const stepMap = stepParent.map((data) => {
        const stepDetail = routeResponse.routes[0].legs[0].steps.slice(
            data.stepStartIndex,
            data.stepEndIndex + 1
        );

        const distanceMeters = stepDetail.reduce(
            (res: number, data) =>
                res + (data?.distanceMeters ? data?.distanceMeters : 1),
            0
        );

        const durations = stepDetail.reduce(
            (res: number, data) =>
                res + Number(data.staticDuration.split('s')[0]),
            0
        );

        if (data.travelMode === "WALK" && distanceMeters >= 2000){
            grabOptions.push({
                startLocation: routeResponse.routes[0].legs[0].steps[data.stepStartIndex].startLocation,
                endLocation: routeResponse.routes[0].legs[0].steps[data.stepEndIndex+1].endLocation,
                grabFare: (distanceMeters == 2000) ? 10000 :
                    10000 + Number.parseFloat(process.env.MOTORCYCLE_FARE!) * (distanceMeters - 2000)
            })
        }

        return {
            instructions: data.navigationInstruction?.instructions ?? '',
            travelMode: data.travelMode,
            distanceMeters,
            durations,
            steps: stepDetail
        };
    });

    return {
        wholePolyline: routeResponse.routes[0].polyline.encodedPolyline,
        distance: routeResponse.routes[0].localizedValues.distance,
        duration: routeResponse.routes[0].localizedValues.duration,
        transitFare: routeResponse.routes[0].localizedValues.transitFare ?? '',
        step: stepMap,
        grabOptions: grabOptions
    };
}

export default routeResponseFormater;
