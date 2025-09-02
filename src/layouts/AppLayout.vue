<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import { ConfirmDialog, Toast } from "primevue";
</script>

<template>
    <div class="font-sans">
        <Sidebar />

        <div class="p-4 sm:ml-64">
            <slot />
        </div>
    </div>

    <Toast />
    <ConfirmDialog />
</template>
