<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import LineChart from '@/components/Dashboard/LineChart.vue'
import BarChart from '@/components/Dashboard/BarChart.vue'
import ProductChart from '@/components/Dashboard/ProductChart.vue'
import StoreOverviewChart from '@/components/Dashboard/StoreOverviewChart.vue'
</script>

<template>
    <AppLayout>
        <div class="py-12">
            <div>
                <div>
                    <div class="grid grid-cols 1 lg:grid-cols-2 gap-3 w-full overflow-x-auto">
                        <div class="bg-white shadow-md p-5 rounded-md">
                            <LineChart />
                        </div>
                        <div class="bg-white shadow-md p-5 rounded-md">
                            <BarChart />
                        </div>
                        <div class="bg-white shadow-md p-5 rounded-md">
                            <ProductChart />
                        </div>
                        <div class="bg-white shadow-md p-5 rounded-md">
                            <StoreOverviewChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
