// src/components/TripsList.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TripsList from '../TripsList.vue'
import { useTripStore } from '../../stores/trips.store'
import { mockTripsApi } from '../../apis/trips.api.mock'
import { useRouter } from 'vue-router'
import router from '../../router'


describe('TripsList', () => {
    vi.mock('vue-router')
    vi.mocked(useRouter).mockReturnValue({
        ...router,
        push: vi.fn()
    })
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('loads and formats trips correctly', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripsList)
        await wrapper.vm.$nextTick()
        await flushPromises()

        const filas = wrapper.findAll('tr')

        expect(mockTripsApi.getTrips).toHaveBeenCalledWith({ start_gte: undefined, start_lte: undefined })
        expect(filas).toHaveLength(6)

        const primeraFila = filas[1]
        expect(primeraFila.find('.start-date').text()).toBe('08:17 - 17/01/2022')
        expect(primeraFila.find('.start-address').text()).toContain('Avenida Apoquindo 291')
        expect(primeraFila.find('.end-date').text()).toBe('18:30 - 18/01/2022')
        expect(primeraFila.find('.end-address').text()).toContain('Avenida Grecia 1043')
        expect(primeraFila.find('.distance').text()).toBe('10.40 kms')
        expect(primeraFila.find('.duration').text()).toBe('25 minutos')
    })

    it('borra los filtros correctamente', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripsList)
        await wrapper.vm.$nextTick()
        await flushPromises()

        const from = wrapper.find('.from');
        (from.element as HTMLInputElement).value = '2024-06-01'
        from.trigger('input')
        await flushPromises()

        const to = wrapper.find('.to');
        (to.element as HTMLInputElement).value = '2024-06-30'
        to.trigger('input')
        await flushPromises()

        const botonBorrar = wrapper.find('.reset-btn')
        await botonBorrar.trigger('click')

        const newFrom = (wrapper.find('.from').element as HTMLInputElement)
        const newTo = (wrapper.find('.to').element as HTMLInputElement)

        expect(newFrom.value).toBe("")
        expect(newTo.value).toBe("")
    })

    it('date lte and gte filters trips', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripsList)
        await wrapper.vm.$nextTick()

        const to = wrapper.find('.to');
        (to.element as HTMLInputElement).value = '2022-01-17'
        to.trigger('input')
        await flushPromises()

        const filas = wrapper.findAll('tr')

        expect(mockTripsApi.getTrips).toHaveBeenLastCalledWith({ start_gte: undefined, start_lte: 1642377600000 })
        expect(filas).toHaveLength(1)
    })


    it('handles invalid date selection', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripsList)
        await wrapper.vm.$nextTick()

        const alertSpy = vi.spyOn(window, "alert");

        const from = wrapper.find('.from');
        (from.element as HTMLInputElement).value = '2024-07-01'
        from.trigger('input')
        await flushPromises()

        const to = wrapper.find('.to');
        (to.element as HTMLInputElement).value = '2024-06-01'
        to.trigger('input')
        await flushPromises()

        await wrapper.vm.$nextTick()

        expect(mockTripsApi.getTrips).toHaveBeenCalledTimes(2)
        expect(alertSpy).toHaveBeenCalledOnce()
    })

    it('clears filters when clear button is clicked', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripsList)
        await wrapper.vm.$nextTick()

        await wrapper.find('.from').setValue('2024-07-01')
        await wrapper.find('.to').setValue('2024-07-31')
        await wrapper.find('.reset-btn').trigger('click')

        expect(wrapper.find('.from').element.nodeValue).toBeNull()
        expect(wrapper.find('.to').element.nodeValue).toBeNull()
    })

    it('clears filters when clear button is clicked', async () => {
        const store = useTripStore()
        store.setApi(mockTripsApi)

        const wrapper = mount(TripsList)
        await wrapper.vm.$nextTick()
        await flushPromises()

        const filas = wrapper.findAll('tr')

        expect(filas).toHaveLength(6)

        const primeraFila = filas[1]
        await primeraFila.find('.detalle-btn').trigger('click')
        expect(useRouter().push).toHaveBeenCalledWith('/trips/5efc0d7da7076973f1515120')
    })
})
