<template>
    <div class="trip-detail-container">
        <h1>Detalle del Viaje</h1>
    
        <div id="map" style="height: 400px;"></div>
    
        <div class="trip-info">
            <div class="start-info">
                <h2>Inicio</h2>
                <div class="start-time">{{ formatDate(trip.start.time) }}</div>
                <div class="start-address">{{ trip.start.address }}</div>
            </div>
            <div class="end-info">
                <h2>Fin</h2>
                <div class="end-time">{{ formatDate(trip.end.time) }}</div>
                <div class="end-address">{{ trip.end.address }}</div>
            </div>
            <div class="trip-stats">
                <div class="distance">{{ trip.distance.toFixed(2) }} kms</div>
                <div class="duration">{{ formatDuration(trip.duration) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTripStore } from '../stores/trips.store'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../assets/trip-detail.css'

const route = useRoute()
const tripStore = useTripStore()
const { trips } = storeToRefs(tripStore)

const trip = ref({
    _id: '',
    start: {
        time: 0,
        address: '',
        lat: 0,
        lon: 0,
    },
    end: {
        time: 0,
        address: '',
        lat: 0,
        lon: 0,
    },
    distance: 0,
    duration: 0,
    overspeedsCount: 0,
    boundingBox: [
        { lat: 0, lon: 0 },
        { lat: 0, lon: 0 },
        { lat: 0, lon: 0 },
        { lat: 0, lon: 0 },
    ]
})

onMounted(async () => {
    if (trips.value.length === 0 ) {
        await tripStore.fetchTrips({})
    }
    trip.value = trips.value.find(t => t._id === route.params.id)
    initMap()
})

const initMap = () => {
    if (!trip.value) return

    const map = L.map('map').setView([trip.value.start.lat, trip.value.start.lon], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Marcador de inicio
    L.marker([trip.value.start.lat, trip.value.start.lon])
        .addTo(map)
        .bindPopup('Inicio')
        .openPopup()

    // Marcador de fin
    L.marker([trip.value.end.lat, trip.value.end.lon])
        .addTo(map)
        .bindPopup('Fin')

    // Bounding box
    const bounds = L.latLngBounds(
        [trip.value.start.lat, trip.value.start.lon],
        [trip.value.end.lat, trip.value.end.lon]
    )
    L.rectangle(bounds, {color: "#4285F4", weight: 1}).addTo(map)

    // Ajustar la vista al bounding box
    map.fitBounds(bounds)
}

const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()
        .toString().padStart(2, '0')} - ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString().padStart(2, '0')}/${date.getFullYear()}`
}

const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000)
    return `${minutes} minutos`
}
</script>

<style scoped>
.trip-detail-container {
  padding: 20px;
}

.trip-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.start-info, .end-info, .trip-stats {
  flex: 1;
}
</style>
