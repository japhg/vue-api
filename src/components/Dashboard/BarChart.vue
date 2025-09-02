<script setup lang="ts">
import Chart from 'primevue/chart'
import { onMounted, ref } from 'vue'

onMounted(() => {
    chartData.value = setChartData()
    chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement)

    return {
        labels: ['JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [
            {
                label: 'This year',
                backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                data: [1000, 2000, 3000, 2500, 2700, 2500, 3000],
            },
            {
                label: 'Last year',
                backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                data: [700, 1700, 2700, 2000, 1800, 1500, 2000],
            },
        ],
    }
}
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--p-text-color')
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500,
                    },
                },
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
            y: {
                min: 0,
                max: 3000,
                ticks: {
                    color: textColorSecondary,
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false,
                },
            },
        },
    }
}
</script>

<template>
    <div>
        <div class="flex justify-between">
            <h5 class="text-lg">Sales</h5>
            <p class="text-sm text-blue-500 hover:text-blue-700">View Report</p>
        </div>

        <div class="flex justify-between mt-5">
            <div class="flex flex-col">
                <h5 class="font-bold">$18,230.00</h5>
                <p class="text-sm">Sales Over Time</p>
            </div>
            <div class="flex flex-col text-end">
                <h5 class="text-green-500"><i class="pi pi-arrow-up" /> 33.1%</h5>
                <p class="text-sm text-gray-500">Since last month</p>
            </div>
        </div>
    </div>
    <div class="w-full relative" style="height: 0; padding-bottom: 50%">
        <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="absolute top-0 left-0 w-full h-full"
        />
    </div>
</template>
