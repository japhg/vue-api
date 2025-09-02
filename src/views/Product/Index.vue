<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import DataTable from '@/components/DataTable.vue'
import { formatDate } from '@/utils/date-formatters'
import TextField from '@/components/Form/TextField.vue'
import SelectField from '@/components/Form/SelectField.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { debounce } from 'lodash'
import api from '@/services/api'
import { useRoute } from 'vue-router'
import PrimaryButton from '@/components/PrimaryButton.vue'
import { Paginator, useToast } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import router from '@/router'

const toast = useToast()
const confirm = useConfirm()
const route = useRoute()
const products = ref(null)
const productCategories = ref([])
const page = ref(0)
const rows = ref(10)

// Fetch the products via API request
const fetchProducts = async () => {
    try {
        const res = await api.get('/products', {
            params: {
                page: page.value + 1,
                per_page: rows.value,
                search: search.value,
                category: filters.category,
            },
        })

        products.value = res.data.products
        productCategories.value = res.data.productCategories
    } catch (error) {
        console.error(error)
    }
}

const columns = [
    { key: 'media', label: 'Image' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'date_and_time', label: 'Date and Time' },
    { key: 'actions', label: 'Actions' },
]

const limitOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
]

const onPageChange = (event: any) => {
    page.value = event.page
    rows.value = event.rows
    fetchProducts()
}

const search = ref(null)
const filters = reactive({
    per_page: 10,
    category: route.query.category,
})

watch(
    search,
    debounce(async (value: any) => {
        try {
            const res = await api.get('/products', {
                params: { search: value },
            })

            products.value = res.data.products
        } catch (error) {
            console.error(error)
        }
    }, 250),
)

watch(
    filters,
    debounce(async (value: any) => {
        try {
            const res = await api.get('/products', {
                params: { ...value },
            })

            products.value = res.data.products
        } catch (error) {
            console.error(error)
        }
    }, 250),
)

onMounted(fetchProducts)
onMounted(() => {
    const toastData = sessionStorage.getItem('toast')
    if (toastData) {
        toast.add(JSON.parse(toastData))
        sessionStorage.removeItem('toast')
    }
})

const handleDeleteProduct = (row: any) => {
    confirm.require({
        message: `Are you sure you want to delete ${row.name}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Yes',
            serverity: 'danger',
        },
        accept: () => {
            deleteProduct(row.id)
        },
    })
}

const deleteProduct = async (id: number) => {
    try {
        const res = await api.delete(`/products/delete/${id}`)

        products.value.data = products.value.data.filter((p) => p.id !== id)
        toast.add({
            severity: 'success',
            summary: 'Updated',
            detail: res.data.message,
            life: 3000,
        })

        router.push('/products')
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <AppLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto md:px-6">
                <div class="bg-white overflow-hidden shadow-md sm:rounded-lg p-5">
                    <!-- Search Products -->
                    <div class="flex items-center justify-between mb-4 px-5">
                        <div class="flex gap-25">
                            <PrimaryButton href="/products/create" class="font-normal">
                                Create
                            </PrimaryButton>
                        </div>
                        <div>
                            <TextField
                                v-model="search"
                                id="search"
                                type="type"
                                name="search"
                                placeholder="Search Products"
                            />
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-4 p-5">
                        <!-- Filter Products -->
                        <div class="flex gap-2">
                            <SelectField
                                v-model="filters.per_page"
                                label="Show"
                                id="show"
                                placeholder="Select"
                                option-label="label"
                                option-value="value"
                                :options="limitOptions"
                            />
                            <SelectField
                                v-model="filters.category"
                                label="Filter by Category"
                                id="category"
                                placeholder="Select an option"
                                option-label="label"
                                option-value="value"
                                :options="productCategories"
                            />
                        </div>
                    </div>

                    <DataTable
                        :columns="columns"
                        :rows="products?.data ?? []"
                        rowKey="id"
                        emptyText="No Products found."
                    >
                        <template #cell-media="{ row }">
                            <div class="h-12 w-12">
                                <img
                                    v-if="row.media?.length > 0 && row.media?.[0].original_url"
                                    :src="row.media?.[0].original_url"
                                    :alt="row.name"
                                    class="h-12 w-12 rounded object-cover border"
                                />
                                <div
                                    v-else
                                    class="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs border"
                                >
                                    N/A
                                </div>
                            </div>
                        </template>

                        <template #cell-name="{ row }">
                            {{ row.name }}
                        </template>

                        <template #cell-category="{ row }">
                            {{ row.category }}
                        </template>

                        <template #cell-description="{ row }">
                            <span v-html="row.description" class="line-clamp-1 break-all" />
                        </template>

                        <template #cell-date_and_time="{ value }">
                            {{ formatDate(value) }}
                        </template>

                        <template #cell-actions="{ row }">
                            <div class="flex flex-col md:flex-row gap-3">
                                <RouterLink
                                    :to="`/products/edit/${row.id}`"
                                    class="inline-flex items-center gap-2 rounded-md bg-secondary-base px-3 py-2 text-sm font-semibold text-emerald-500 shadow hover:bg-secondary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-base"
                                    :aria-label="`Edit ${row.name}`"
                                >
                                    Edit
                                </RouterLink>
                                <button
                                    type="button"
                                    @click="handleDeleteProduct(row)"
                                    class="inline-flex items-center gap-2 rounded-md bg-secondary-base px-3 py-2 text-sm font-semibold text-red-500 shadow hover:bg-secondary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-base hover:cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </template>
                    </DataTable>

                    <Paginator
                        :rows="filters.per_page"
                        :totalRecords="products?.total"
                        :first="page * rows"
                        @page="onPageChange"
                    />
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style>
.p-toast-message {
    margin-top: 50px !important;
}
</style>
