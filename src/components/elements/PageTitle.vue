<script setup>
defineProps({
    value: String,
    subText: String,
});
</script>

<template>
    <h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-50">
        <slot />
        <template v-if="subText">
            : <span class="text-blue-600 dark:text-blue-300 font-medium">{{ subText }}</span>
        </template>
    </h1>
</template>
