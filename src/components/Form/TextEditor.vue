<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { computed } from 'vue'
import InputError from '../InputError.vue'
import InputLabel from '../InputLabel.vue'

const props = defineProps<{
  modelValue: string
  label?: string
  error?: string
  required?: boolean
  id?: string
}>()

const emit = defineEmits(['update:modelValue'])

const proxyModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ['clean'],
]
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-end">
      <InputLabel :for="id">
        {{ label }} <span v-if="required" class="text-gray-500">*</span>
      </InputLabel>
    </div>
    
    <QuillEditor
      v-model:content="proxyModel"
      content-type="html"
      :toolbar="toolbarOptions"
      theme="snow"
    />

    <InputError :message="error" />
  </div>
</template>
