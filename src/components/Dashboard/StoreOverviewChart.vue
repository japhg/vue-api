<template>
    <div class="bg-white rounded-lg">
        <div class="flex justify-between pb-8">
            <h2 class="text-lg">Online Store Overview</h2>
            <div class="flex items-center gap-2 text-gray-500">
                <i class="pi pi-download w-5 h-5" />
                <i class="pi pi-bars" />
            </div>
        </div>

        <div class="space-y-6">
            <OverviewRow
                icon="pi pi-refresh"
                iconColor="text-green-500"
                label="CONVERSION RATE"
                change="12"
                direction="up"
            />
            <hr />
            <OverviewRow
                icon="pi pi-shopping-cart"
                iconColor="text-yellow-500"
                label="SALES RATE"
                change="0.8"
                direction="up"
            />
            <hr />
            <OverviewRow
                icon="pi pi-users"
                iconColor="text-red-500"
                label="REGISTRATION RATE"
                change="1"
                direction="down"
            />
        </div>
    </div>
</template>

<script setup>
import OverviewRow from './OverviewRow.vue'
</script>
