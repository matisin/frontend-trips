export interface Trip {
    _id: string
    start: {
        time: number
        address: string
        lat: number
        lon: number
    }
    end: {
        time: number
        address: string
        lat: number
        lon: number
    }
    distance: number
    duration: number
    overspeedsCount: number
    boundingBox: [
        { lat: number, lon: number },
        { lat: number, lon: number },
        { lat: number, lon: number },
        { lat: number, lon: number },
    ]
}

export interface ApiResponse<T> {
    data: T
}

export interface TripFilters {
    start_gte?: number
    start_lte?: number
    distance_gte?: number
    limit?: number
    offset?: number
}

export interface TripsApi {
    getTrips(filters: TripFilters): Promise<ApiResponse<Trip[]>>
}
