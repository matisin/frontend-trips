<template>
    <div class="trips-container">
        <h1>Viajes</h1>
    
        <div class="filters">
            <div class="date-filter">
                <label for="desde">Desde:</label>
                <input id="desde" class="from" v-model="filters.desde" type="date" placeholder="Desde">
            </div>
            <div class="date-filter">
                <label for="hasta">Hasta:</label>
                <input id="hasta" class="to" v-model="filters.hasta" type="date" placeholder="Hasta">
            </div>
            <button class="reset-btn" @click="borrarFiltros">Borrar Filtros</button>
        </div>
    
        <table class="trips-table">
            <thead>
                <tr>
                    <th>Inicio</th>
                    <th>Término</th>
                    <th>Distancia y tiempo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="trip in trips" :key="trip._id" class="row-trips">
                    <td>
                        <div class="start-date">{{ formatDate(trip.start.time) }}</div>
                        <div class="start-address">{{ trip.start.address }}</div>
                    </td>
                    <td>
                        <div class="end-date">{{ formatDate(trip.end.time) }}</div>
                        <div class="end-address">{{ trip.end.address }}</div>
                    </td>
                    <td>
                        <div class="distance-time">
                            <div class="distance-duration">
                                <span class="distance">{{ trip.distance.toFixed(2) }} kms</span>
                                <span class="duration">{{ formatDuration(trip.duration) }}</span>
                            </div>
                            <div class="separator"></div>
                                <button @click="verDetalles(trip._id)" class="detalle-btn">></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { watch, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTripStore } from '../stores/trips.store'
import '../assets/trips-list.css'

const tripStore = useTripStore()
const router = useRouter()
const filters = ref({ desde: '', hasta: '' })

const { trips } = storeToRefs(tripStore)

onMounted(() => {
    fetchTrips()
})

const fetchTrips = async () => {
    const gte = filters.value.desde !== ""  ? new Date(filters.value.desde).getTime() : null
    const lte = filters.value.hasta !== ""  ? new Date(filters.value.hasta).getTime() : null
    if (gte !== null && lte !== null && gte > lte) {
        alert('La fecha hasta no puede ser menor a desde')
        return
    }
    await tripStore.fetchTrips({
        start_gte: gte,
        start_lte: lte
    })
}

watch(filters, () => {
    fetchTrips()
}, { deep: true })

const borrarFiltros = () => {
    filters.value = { desde: '', hasta: '' }
    fetchTrips()
}

const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString()
        .padStart(2, '0')} - ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString().padStart(2, '0')}/${date.getFullYear()}`
}

const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000)
    return `${minutes} minutos`
}

const verDetalles = (id) => {
    router.push(`/trips/${id}`)
}
</script>
