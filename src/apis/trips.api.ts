import axios from 'axios'
import type { Trip, TripFilters, ApiResponse, TripsApi } from '../types/api'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const tripsApi: TripsApi = {
    async getTrips(filters: TripFilters): Promise<ApiResponse<Trip[]>> {
        const response = await axiosInstance.get('/api/trips', { params: filters })
        return response
    }
}
