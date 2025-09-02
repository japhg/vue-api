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
import router from '@/router'

const toast = useToast()
const form = reactive({
    name: '',
    category: '',
    description: '',
    date_and_time: '',
    files: [],
})

const stepValue = ref('1')
const errors = ref({})

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

    if (form.files.length <= 0) {
        errors.value.files = 'File is required.'
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

const submit = async () => {
    try {
        const formData = new FormData()

        formData.append('name', form.name)
        formData.append('category', form.category)
        formData.append('description', form.description)
        formData.append(
            'date_and_time',
            form.date_and_time ? new Date(form.date_and_time).toISOString() : '',
        )

        form.files.forEach((file, i) => {
            formData.append(`files[${i}]`, file)
        })

        let token = localStorage.getItem('token')
        const res = await api.post('/products/store', formData, {
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
    }
}

const productCategories = ref([])

const fetchCategories = async () => {
    try {
        const res = await api.get('/products')
        productCategories.value = res.data.productCategories
    } catch (error) {
        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors || {}
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong.',
                life: 3000,
            })
            console.error(error)
        }
    }
}

onMounted(fetchCategories)
</script>

<template>
    <AppLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto md:px-6">
                <div class="bg-white overflow-hidden shadow-md sm:rounded-lg p-5">
                    <h2 class="text-xl font-semibold">Create Product</h2>

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
                                    <div class="flex flex-col">
                                        <FileUpload
                                            v-model="form.files"
                                            name="files[]"
                                            customUpload
                                            :auto="false"
                                            @select="handleFileUpload"
                                            accept="image/*"
                                            multiple
                                            :max-file-size="2097152"
                                            :max-file-count="10"
                                            chooseLabel="Browse"
                                        />

                                        <small v-if="errors.files" class="text-red-500">
                                            {{ errors.files }}
                                        </small>
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

                                            <small v-if="errors.length > 0" class="text-red-500">
                                                {{ errors }}
                                            </small>
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
