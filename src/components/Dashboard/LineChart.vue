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
        labels: ['18th', '20th', '22nd', '24th', '26th', '28th', '30th'],
        datasets: [
            {
                label: 'This Week',
                data: [100, 120, 170, 167, 180, 177, 160],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4,
            },
            {
                label: 'Last Week',
                data: [60, 80, 70, 67, 80, 77, 100],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                tension: 0.4,
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
        aspectRatio: 0.6,
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
                },
                grid: {
                    color: surfaceBorder,
                },
            },
            y: {
                min: 0,
                max: 200,
                ticks: {
                    color: textColorSecondary,
                },
                grid: {
                    color: surfaceBorder,
                },
            },
        },
    }
}
</script>
<template>
    <div>
        <div class="flex justify-between">
            <h5 class="text-lg">Online Store Visitors</h5>
            <p class="text-sm text-blue-500 hover:text-blue-700">View Report</p>
        </div>

        <div class="flex justify-between mt-5">
            <div class="flex flex-col">
                <h5 class="font-bold">820</h5>
                <p class="text-sm">Visitors Over Time</p>
            </div>
            <div class="flex flex-col text-end">
                <h5 class="text-green-500"><i class="pi pi-arrow-up" /> 12.5%</h5>
                <p class="text-sm text-gray-500">Since last week</p>
            </div>
        </div>
    </div>

    <div class="w-full relative" style="height: 0; padding-bottom: 50%">
        <Chart
            type="line"
            :data="chartData"
            :options="chartOptions"
            class="absolute top-0 left-0 w-full h-full"
        />
    </div>
    <!-- <Chart type="line" :data="chartData" :options="chartOptions" class="h-[20rem]" /> -->
</template>
