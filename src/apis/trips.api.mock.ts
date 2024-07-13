import { vi } from 'vitest'
import type { Trip, ApiResponse, TripFilters, TripsApi } from '../types/api'

export const mockTrips: Trip[] = [
    {
        _id: "5efc0d7da7076973f1515120",
        start: {
            time: 1642418228000,
            lat: -33.580158,
            lon: -70.567227,
            address: "Avenida Apoquindo 291"
        },
        end: {
            time: 1642541428000,
            lat: -33.580462,
            lon: -70.567177,
            address: "Avenida Grecia 1043"
        },
        distance: 10.4,
        duration: 1500000,
        overspeedsCount: 2,
        boundingBox: [
            {
                lat: -33.580462,
                lon: -70.567177
            },
            {
                lat: -33.580432,
                lon: -70.567147
            },
            {
                lat: -33.580432,
                lon: -70.567147
            },
            {
                lat: -33.580433,
                lon: -70.567144
            }
        ]
    },
    {
        _id: "5efc0d7da7076973f1515121",
        start: {
            time: 1642541528000,
            lat: -33.543158,
            lon: -70.553227,
            address: "Avenida La Florida 923"
        },
        end: {
            time: 1642541828000,
            lat: -33.580542,
            lon: -70.554177,
            address: "Avenida El Peñón 65"
        },
        distance: 4.5,
        duration: 300000,
        overspeedsCount: 0,
        boundingBox: [
            {
                lat: -33.580462,
                lon: -70.567177
            },
            {
                lat: -33.580432,
                lon: -70.567147
            },
            {
                lat: -33.580432,
                lon: -70.567147
            },
            {
                lat: -33.580433,
                lon: -70.567144
            }
        ]
    },
    {
        _id: "669150dbd5fd7d6d59fd7473",
        start: {
            lat: -33.580158,
            lon: -70.567227,
            address: "Avenida Apoquindo 300",
            time: 1642500462000
        },
        end: {
            lat: -33.580053,
            lon: -70.568502,
            address: "1090, Avenida El Peñón, Villa Los Prados, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8207897, Chile",
            time: 1642500498000
        },
        distance: 0.27396236796786444,
        duration: 36000,
        overspeedsCount: 0,
        boundingBox: [
            {
                lat: -33.580158,
                lon: -70.568502
            },
            {
                lat: -33.580158,
                lon: -70.566408
            },
            {
                lat: -33.580005,
                lon: -70.566408
            },
            {
                lat: -33.580005,
                lon: -70.568502
            }
        ]
    },
    {
        _id: "6691510fd5fd7d6d59fd7474",
        start: {
            lat: -33.580158,
            lon: -70.567227,
            address: "Avenida Apoquindo 300",
            time: 1642500462000
        },
        end: {
            lat: -33.580053,
            lon: -70.568502,
            address: "1090, Avenida El Peñón, Villa Los Prados, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8207897, Chile",
            time: 1642500498000
        },
        distance: 0.27396236796786444,
        duration: 36000,
        overspeedsCount: 0,
        boundingBox: [
            {
                lat: -33.580158,
                lon: -70.568502
            },
            {
                lat: -33.580158,
                lon: -70.566408
            },
            {
                lat: -33.580005,
                lon: -70.566408
            },
            {
                lat: -33.580005,
                lon: -70.568502
            }
        ]
    },
    {
        _id: "66915204d5fd7d6d59fd7477",
        start: {
            lat: -33.580158,
            lon: -70.567227,
            address: "Avenida Apoquindo 300",
            time: 1642500462000
        },
        end: {
            lat: -33.58022,
            lon: -70.5715,
            address: "3244, Valle de Copiapó, Villa Los Prados, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8207897, Chile",
            time: 1642500538000
        },
        distance: 0.5523572031060133,
        duration: 76000,
        overspeedsCount: 1,
        boundingBox: [
            {
                lat: -33.58022,
                lon: -70.5715
            },
            {
                lat: -33.58022,
                lon: -70.566408
            },
            {
                lat: -33.580005,
                lon: -70.566408
            },
            {
                lat: -33.580005,
                lon: -70.5715
            }
        ]
    }
]

export const mockTripsApi: TripsApi = {
    getTrips: vi.fn<[TripFilters], Promise<ApiResponse<Trip[]>>>((filters: TripFilters) => {
        const limit = filters.limit || 10
        const offset = filters.offset || 0
        const filteredTrips = mockTrips
            .filter(trip => {
                if (filters.start_gte && trip.start.time < filters.start_gte) return false
                if (filters.start_lte && trip.end.time > filters.start_lte) return false
                if (filters.distance_gte && trip.distance < filters.distance_gte) return false
                return true
            })

        return Promise.resolve({
            data: filteredTrips.slice(offset, offset + limit),
            total: filteredTrips.length,
            page: Math.floor(offset / limit) + 1,
            limit: limit
        })
    })
}
