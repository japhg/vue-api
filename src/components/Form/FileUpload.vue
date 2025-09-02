<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-between items-end">
            <InputLabel :for="id">
                <div class="flex items-center gap-1">
                    <PaperClipIcon class="w-4 h-4 text-gray-600" />
                    {{ label }}
                    <span v-if="required" class="text-red-500">*</span>
                </div>
            </InputLabel>
            <p v-if="helper" class="text-sm text-gray-800">{{ helper }}</p>
        </div>

        <input
            :id="id"
            :name="name"
            type="file"
            class="hidden"
            :multiple="multiple"
            @change="onFileSelect"
            accept="image/*"
            ref="fileInput"
        />

        <button
            type="button"
            class="px-4 py-2 border rounded w-fit text-sm text-gray-700 hover:bg-gray-100"
            @click="triggerFileInput"
        >
            Choose File
        </button>

        <div v-if="srcs.length" class="flex flex-wrap gap-2 mt-2">
            <div v-for="(src, i) in srcs" :key="i" class="relative w-32 h-32">
                <img :src="src" class="shadow-md rounded-xl w-32 h-32 object-cover" />
                <button
                    type="button"
                    class="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full px-1 text-xs"
                    @click="removeFile(i)"
                >
                    ✕
                </button>
            </div>
        </div>

        <p v-if="fileName && srcs.length <= 1" class="text-gray-600 text-sm truncate">
            {{ fileName }}
        </p>

        <InputError :message="error" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PaperClipIcon from '../Icons/PaperClipIcon.vue'
import InputLabel from '../InputLabel.vue'
import InputError from '../InputError.vue'

const props = defineProps<{
    modelValue: File[]
    label: string
    required?: boolean
    helper?: string
    name: string
    id: string
    alt?: string
    multiple?: boolean
    error: string
}>()

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)
const srcs = ref<string[]>([])
const fileName = ref<string | null>(null)

const updateFiles = (files: File[]) => {
    emit('update:modelValue', files)
    fileName.value = files.map((f) => f.name).join(', ')
    srcs.value = []

    files.forEach((file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                srcs.value.push(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    })
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const onFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = input.files ? Array.from(input.files) : []
    updateFiles(files)
}

const removeFile = (index: number) => {
    const currentFiles = [...(props.modelValue || [])]
    currentFiles.splice(index, 1)
    updateFiles(currentFiles)
}
</script>
