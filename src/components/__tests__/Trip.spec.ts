import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TripDetail from '../TripDetail.vue'
import { useTripStore } from '../../stores/trips.store'
import { mockTripsApi } from '../../apis/trips.api.mock'
import { useRoute } from 'vue-router'
import L from 'leaflet'

describe('TripDetail', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        vi.mock('vue-router')
        vi.mock('leaflet', () => ({
            default: {
                map: vi.fn(() => ({
                    setView: vi.fn(() => ({
                        fitBounds: vi.fn(),
                    })),
                })),
                tileLayer: vi.fn(() => ({
                    addTo: vi.fn(),
                })),
                marker: vi.fn(() => ({
                    addTo: vi.fn(() => ({
                        bindPopup: vi.fn(() => ({
                            openPopup: vi.fn()
                        })),
                    })),
                })),
                latLngBounds: vi.fn(),
                rectangle: vi.fn(() => ({
                    addTo: vi.fn(),
                })),
            }
        }))
        vi.mocked(useRoute).mockReturnValue({
            params: { id: '5efc0d7da7076973f1515120' },
        } as any)
    })

    it('renders the map and trip details correctly', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripDetail)
        await flushPromises()
        // Verifica que el mapa se haya renderizado
        expect(wrapper.find('#map').exists()).toBe(true)

        // Verifica que se hayan creado los marcadores de inicio y fin
        expect(L.marker).toHaveBeenCalledTimes(2)

        // Verifica que se haya creado el bounding box
        expect(L.rectangle).toHaveBeenCalledTimes(1)

        // Verifica que la información del viaje sea correcta
        expect(wrapper.find('.start-address').text()).toContain('Avenida Apoquindo 291')
        expect(wrapper.find('.end-address').text()).toContain('Avenida Grecia 1043')
        expect(wrapper.find('.distance').text()).toBe('10.40 kms')
        expect(wrapper.find('.duration').text()).toBe('25 minutos')
    })

    it('places start and end markers correctly', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        mount(TripDetail)
        await flushPromises()

        // Verifica que se hayan creado marcadores para el inicio y fin del viaje
        expect(L.marker).toHaveBeenCalledWith([-33.3867, -70.5454]) // Inicio
        expect(L.marker).toHaveBeenCalledWith([-33.4422, -70.6459]) // Fin
    })

    it('displays correct trip information', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripDetail)
        await flushPromises()

        expect(wrapper.find('.start-time').text()).toBe('08:17 - 17/01/2022')
        expect(wrapper.find('.end-time').text()).toBe('18:30 - 18/01/2022')
        expect(wrapper.find('.start-address').text()).toContain('Avenida Apoquindo 291')
        expect(wrapper.find('.end-address').text()).toContain('Avenida Grecia 1043')
        expect(wrapper.find('.distance').text()).toBe('10.40 kms')
        expect(wrapper.find('.duration').text()).toBe('25 minutos')
    })
})
