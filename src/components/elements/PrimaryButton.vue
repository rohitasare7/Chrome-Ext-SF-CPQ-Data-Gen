<script setup>
defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    isRed: Boolean,
    isBlue: Boolean,
});
</script>

<template>
    <button :type="type" :class="{
        'bg-gray-800 dark:text-gray-800 dark:hover:bg-white hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 dark:focus:ring-offset-gray-800': !isRed && !isBlue, // Default background
        'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-gray-800 dark:hover:text-red-100 focus:bg-red-700 focus:ring-red-500': isRed,
        'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-800 dark:hover:text-blue-100 focus:bg-blue-700 focus:ring-blue-500': isBlue,
        'inline-flex items-center px-4 py-2 dark:bg-gray-200 border border-transparent rounded-2xl font-semibold text-xs text-white uppercase tracking-widest dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  transition ease-in-out duration-150': true,
    }">
        <slot />
    </button>
</template>