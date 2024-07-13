import { defineStore } from 'pinia'
import type { TripsApi, Trip, TripFilters, ApiResponse } from '../types/api'
import { tripsApi } from '../apis/trips.api'

export const useTripStore = defineStore('trips', {
    state: () => ({
        trips: [] as Trip[],
        api: tripsApi as TripsApi
    }),
    actions: {
        async fetchTrips(filters: TripFilters) {
            try {
                const response = await this.api.getTrips(filters)
                this.setTrips(response, filters)
            } catch (error) {
                console.error('Error fetching trips:', error)
                throw error
            }
        },
        setTrips(response: ApiResponse<Trip[]>, filters: TripFilters) {
            this.trips = response.data
        },
        setApi(api: TripsApi) {
            this.api = api
        }
    }
})
