export default interface GoogleRouteResponse {
    routes: {
        legs: {
            steps: {
                distanceMeters: number;
                staticDuration: string;
                polyline: {
                    encodedPolyline: string;
                };
                startLocation: {
                    latLng: {
                        latitude: number;
                        longitude: number;
                    };
                };
                endLocation: {
                    latLng: {
                        latitude: number;
                        longitude: number;
                    };
                };
                navigationInstruction: {
                    maneuver: string;
                    instructions: string;
                };
                localizedValues: {
                    distance: { text: string };
                    staticDuration: { text: string };
                };
                travelMode: string;
            }[];
            stepsOverview: {
                multiModalSegments: {
                    stepStartIndex: number;
                    stepEndIndex: number;
                    navigationInstruction: {
                        instructions: string;
                    };
                    travelMode: string;
                }[];
            };
        }[];
        polyline: {
            encodedPolyline: string;
        };
        travelAdvisory: {
            transitFare: {
                currencyCode: string;
                units: number;
            };
        };
        localizedValues: {
            distance: {
                text: string;
            };
            duration: {
                text: string;
            };
            staticDuration: {
                text: string;
            };
            transitFare: {
                text: string;
            };
        };
    }[];
}