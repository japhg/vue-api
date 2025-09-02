<script setup lang="ts">
import products from '@/data/dashboard-products.json'
import PrimaryButton from '../PrimaryButton.vue'
</script>
<template>
    <div class="bg-white rounded-lg overflow-hidden">
        <div class="w-fit">
            <PrimaryButton href="/products/create" class="">Create Product</PrimaryButton>
        </div>
        <div class="flex justify-between p-4">
            <h2 class="text-lg">Products</h2>
            <div class="flex items-center gap-2 text-gray-500">
                <i class="pi pi-download w-5 h-5" />
                <i class="pi pi-bars" />
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Price
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Sales
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            More
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(product, index) in products" :key="index">
                        <td class="px-6 py-4 flex items-center gap-3">
                            <div
                                class="w-10 h-10 bg-gray-400 rounded-full text-white flex items-center justify-center text-[4px]"
                            >
                                150 x 150
                            </div>
                            <div class="text-sm font-medium text-gray-900 flex items-center gap-1">
                                {{ product.name }}
                                <span
                                    v-if="product.new"
                                    class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded"
                                >
                                    NEW
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900">{{ product.price }}</td>
                        <td class="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                            <span
                                :class="[
                                    product.change > 0
                                        ? 'text-green-500'
                                        : product.change < 0
                                          ? 'text-red-500'
                                          : 'text-yellow-500',
                                    'flex items-center gap-1 font-medium',
                                ]"
                            >
                                <span v-if="product.change > 0">
                                    <i class="pi pi-sort-up-fill" />
                                </span>
                                <span v-else-if="product.change < 0">
                                    <i class="pi pi-sort-down-fill" />
                                </span>
                                <span>{{ Math.abs(product.change) }}%</span>
                            </span>
                            <span class="text-gray-600 text-xs">
                                {{ product.sales.toLocaleString() }} Sold
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <button class="text-gray-500 hover:text-gray-700">
                                <i class="pi pi-search" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
