<script setup>
defineProps({
    value: String,
});
</script>

<template>
    <p class="mt-2 mb-2 text-gray-500 dark:text-gray-400 leading-relaxed">
        <slot />
    </p>
</template>
