<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <i :class="[iconColor, icon, 'text-7xl']" />
        </div>
        <div class="flex-1 text-right">
            <div
                :class="[
                    'text-sm font-bold',
                    direction === 'up'
                        ? 'text-green-600'
                        : direction === 'down'
                          ? 'text-red-600'
                          : 'text-gray-500',
                ]"
            >
                <span>{{ direction === 'up' ? '↑' : '↓' }}</span>
                <span>{{ change }}%</span>
            </div>
            <div class="text-gray-500 text-xs font-medium mt-0.5 tracking-wide uppercase">
                {{ label }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    icon: String,
    iconColor: String,
    label: String,
    change: [Number, String],
    direction: {
        type: String,
        validator: (val) => ['up', 'down'].includes(val),
    },
})
</script>
