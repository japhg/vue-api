<script setup lang="ts">
import { Checkbox } from "primevue";
import { computed } from "vue";
import InputLabel from "../InputLabel.vue";

const emit = defineEmits(["update:checked"]);

const props = defineProps<{
    checked: boolean;
    value: string;
    id?: string;
    label: string;
    required?: boolean;
}>();

const proxyChecked = computed({
    get() {
        return props.checked;
    },

    set(val) {
        emit("update:checked", val);
    },
});
</script>

<template>
    <div class="flex items-center gap-2">
        <Checkbox v-model="proxyChecked" binary :required="required" />

        <InputLabel :for="id">
            {{ label }} <span v-if="required" class="text-gray-500">*</span>
        </InputLabel>
    </div>
</template>
