<script setup lang="ts">
type Column = {
    key: string;
    label: string;
    thClass?: string;
    tdClass?: string;
};

const props = defineProps<{
    columns: Column[];
    rows: any[];
    rowKey?: string | ((row: any) => string | number);
    emptyText?: string;
}>();

const getRowKey = (row: any, index: number) => {
    if (typeof props.rowKey === "function") return props.rowKey(row);
    if (typeof props.rowKey === "string")
        return (row as any)?.[props.rowKey] ?? index;
    return (row as any)?.id ?? index;
};
</script>

<template>
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th
                        v-for="col in props.columns"
                        :key="col.key"
                        :class="[
                            'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                            col.thClass,
                        ]"
                    >
                        <slot :name="`header-${col.key}`">
                            {{ col.label }}
                        </slot>
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr
                    v-for="(row, rIndex) in props.rows"
                    :key="getRowKey(row, rIndex)"
                    class="hover:bg-gray-50"
                >
                    <td
                        v-for="col in props.columns"
                        :key="col.key"
                        :class="['px-4 py-3', col.tdClass]"
                    >
                        <slot
                            :name="`cell-${col.key}`"
                            :row="row"
                            :value="(row as any)?.[col.key]"
                            :index="rIndex"
                        >
                            {{ (row as any)?.[col.key] }}
                        </slot>
                    </td>
                </tr>
                <tr v-if="props.rows.length === 0">
                    <td
                        :colspan="props.columns.length"
                        class="px-4 py-6 text-center text-gray-500"
                    >
                        {{ props.emptyText ?? "No records found." }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
