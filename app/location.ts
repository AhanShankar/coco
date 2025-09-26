import * as Location from 'expo-location';
const LOCATION_TIMEOUT = 5 * 1000; // 5 seconds
***REMOVED***
class LocationTimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LocationTimeoutError";
    }
}
export default async function getLocation(): Promise<Location.LocationObject> {
    try {
        await getLocationPermission();
        let lastLocation = await Location.getLastKnownPositionAsync();
        let currentLocation:Location.LocationObject | null = null;
        if (!lastLocation)
            currentLocation = await getCurrentPositionWithTimeout(LOCATION_TIMEOUT);
        // @ts-ignore
        return lastLocation || currentLocation;
    }
    catch (err) {
            if (err instanceof LocationTimeoutError)
            {
                console.log("Location request timed out, using fallback location:", FALLBACK_LOCATION);
                return {coords: FALLBACK_LOCATION} as Location.LocationObject;
            }
            throw err;
    }
}
const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("Location permission status:", status);
    if (status !== 'granted') {
        console.log("Location permission denied");
        throw new Error('Permission to access location was denied');
    }
}
const getCurrentPositionWithTimeout = async (timeout: number): Promise<Location.LocationObject> => {
    let location = await Location.getLastKnownPositionAsync()
    console.log("Last known location:", location);
    const result = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }),
        new Promise((_, reject) =>
            setTimeout(() => reject(new LocationTimeoutError('Location request timed out')), timeout)
        )
    ]);
    return result as Location.LocationObject;
};