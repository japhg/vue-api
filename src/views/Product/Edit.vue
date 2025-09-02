<script setup lang="ts">
import TextField from '@/components/Form/TextField.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import {
    Button,
    DatePicker,
    FileUpload,
    Step,
    StepList,
    StepPanel,
    StepPanels,
    Stepper,
    useToast,
} from 'primevue'
import { onMounted, reactive, ref } from 'vue'
import api from '@/services/api'
import SelectField from '@/components/Form/SelectField.vue'
import TextEditor from '@/components/Form/TextEditor.vue'
import axios from 'axios'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const stepValue = ref('1')
const errors = ref({})

const form = reactive({
    name: '',
    category: '',
    description: '',
    date_and_time: '',
    files: [],
})

const existingMedia = ref<{ id: number; url: string }[]>([])

onMounted(async () => {
    await fetchCategories()
    await fetchProduct()
})

const productCategories = ref([])

const fetchCategories = async () => {
    try {
        const res = await api.get('/products')
        productCategories.value = res.data.productCategories
    } catch (error) {
        console.error(error)
    }
}

const product = ref({})
const fetchProduct = async () => {
    try {
        const res = await api.get(`/products/edit/${route.params.id}`)
        product.value = res.data.product

        form.name = product.value.name
        form.category = product.value.category
        form.description = product.value.description
        form.date_and_time = product.value.date_and_time
        existingMedia.value = res.data.media
    } catch (error) {
        console.error(error)
    }
}

function validateStep1() {
    errors.value = {}

    if (!form.name) {
        errors.value.name = 'Name is required.'
    }
    if (!form.category) {
        errors.value.category = 'Category is required.'
    }
    if (!form.description) {
        errors.value.description = 'Description is required.'
    }

    return Object.keys(errors.value).length === 0
}

function validateStep2() {
    errors.value = {}

    if (form.files.length <= 0 && existingMedia.value.length <= 0) {
        errors.value.files = 'At least one file is required.'
    }

    return Object.keys(errors.value).length === 0
}

const nextStep = (step: any, validator: any) => {
    if (!validator || validator()) {
        stepValue.value = step
    }
}

const handleFileUpload = (event: any) => {
    form.files = event.files
}

const removeExistingFile = async (id: number) => {
    try {
        let token = localStorage.getItem('token')

        await api.delete(`/products/media/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        existingMedia.value = existingMedia.value.filter((f) => f.id !== id)

        toast.add({
            severity: 'success',
            summary: 'Removed',
            detail: 'File deleted.',
            life: 2000,
        })
    } catch (e) {
        console.error(e)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not delete file.',
            life: 2000,
        })
    }
}

const submit = async () => {
    try {
        let token = localStorage.getItem('token')
        const formData = new FormData()

        formData.append('name', form.name)
        formData.append('category', form.category)
        formData.append('description', form.description)
        formData.append('date_and_time', new Date(form.date_and_time).toISOString())

        if (form.files.length > 0) {
            form.files.forEach((file, i) => {
                formData.append(`files[${i}]`, file)
            })
        }

        formData.append('_method', 'PUT')

        const res = await api.post(`/products/update/${route.params.id}`, formData, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })

        sessionStorage.setItem(
            'toast',
            JSON.stringify({
                severity: 'success',
                summary: 'Updated',
                detail: res.data.message,
                life: 2000,
            }),
        )

        router.push('/products')
    } catch (error) {
        console.error(error)

        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors || {}
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong.',
                life: 3000,
            })
        }
    }
}
</script>

<template>
    <AppLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto md:px-6">
                <div class="bg-white overflow-hidden shadow-md sm:rounded-lg p-5">
                    <h2 class="text-xl font-semibold">Edit Product</h2>

                    <div class="card flex justify-center">
                        <Stepper :value="stepValue" class="basis-[50rem]">
                            <StepList>
                                <Step value="1" disabled>Step 1</Step>
                                <Step value="2" disabled>Step 2</Step>
                                <Step value="3" disabled>Step 3</Step>
                            </StepList>
                            <StepPanels>
                                <!-- Step 1 -->
                                <StepPanel value="1">
                                    <div class="flex flex-col gap-5">
                                        <div>
                                            <TextField
                                                v-model="form.name"
                                                label="Name"
                                                name="name"
                                                id="name"
                                                required
                                                :error="errors.name"
                                            />
                                        </div>

                                        <SelectField
                                            v-model="form.category"
                                            label="Category"
                                            id="category"
                                            placeholder="Select an option"
                                            option-label="label"
                                            option-value="value"
                                            :options="productCategories"
                                            required
                                            :error="errors.category"
                                        />

                                        <TextEditor
                                            v-model="form.description"
                                            label="Description"
                                            required
                                            :error="errors.description"
                                        />
                                    </div>
                                    <div class="flex pt-6 justify-between w-full">
                                        <RouterLink
                                            severity="secondary"
                                            to="/products"
                                            class="flex items-center gap-2 bg-gray-100 rounded-md px-3 text-gray-500 font-medium"
                                        >
                                            <i class="pi pi-arrow-left"></i>
                                            Back
                                        </RouterLink>
                                        <Button
                                            label="Next"
                                            icon="pi pi-arrow-right"
                                            iconPos="right"
                                            @click="nextStep('2', validateStep1)"
                                        />
                                    </div>
                                </StepPanel>

                                <!-- Step 2 -->
                                <StepPanel value="2">
                                    <FileUpload
                                        v-model="form.files"
                                        name="files[]"
                                        customUpload
                                        :auto="false"
                                        @select="handleFileUpload"
                                        accept="image/*"
                                        multiple
                                        chooseLabel="Browse"
                                    />
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                                        <div
                                            v-for="file in existingMedia"
                                            :key="file.id"
                                            class="relative w-32 h-32"
                                        >
                                            <img
                                                :src="file.url"
                                                class="shadow-md rounded-xl w-32 h-32 object-cover"
                                            />
                                            <button
                                                type="button"
                                                class="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full px-1 text-xs"
                                                @click="removeExistingFile(file.id)"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex pt-6 justify-between">
                                        <Button
                                            label="Back"
                                            severity="secondary"
                                            icon="pi pi-arrow-left"
                                            @click="nextStep('1')"
                                        />
                                        <Button
                                            label="Next"
                                            icon="pi pi-arrow-right"
                                            iconPos="right"
                                            @click="nextStep('3', validateStep2)"
                                        />
                                    </div>
                                </StepPanel>

                                <!-- Step 3 -->
                                <StepPanel value="3">
                                    <div class="flex flex-col h-48">
                                        <div>
                                            <DatePicker
                                                id="datepicker-12h"
                                                v-model="form.date_and_time"
                                                showTime
                                                showIcon
                                                hourFormat="12"
                                                fluid
                                            />

                                            <small class="text-red-500">{{}}</small>
                                        </div>
                                    </div>
                                    <div class="flex pt-6 justify-between">
                                        <Button
                                            label="Back"
                                            severity="secondary"
                                            icon="pi pi-arrow-left"
                                            @click="nextStep('2')"
                                        />
                                        <Button
                                            label="Submit"
                                            severity="primary"
                                            icon="pi pi-arrow-right"
                                            iconPos="right"
                                            @click="submit"
                                        />
                                    </div>
                                </StepPanel>
                            </StepPanels>
                        </Stepper>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
