<script setup>
defineProps({
    type: {
        type: String,
        default: 'button',
    },
    icon: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: '',
    },
    isSquare: {
        type: Boolean,
        default: false
    },
});

</script>

<template>
    <button :type="type"
        class="inline-flex items-center p-1.5 border shadow-md rounded-full font-semibold text-xs focus:outline-none disabled:opacity-25 transition ease-in-out duration-300"
        :class="{
            'bg-rose-100 hover:bg-rose-200 border-rose-300/50 dark:bg-rose-700 dark:hover:bg-rose-600 dark:border-rose-900 ': color == 'red',
            'bg-green-100 hover:bg-green-200 border-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:border-green-900 ': color == 'green',
            'bg-blue-100 hover:bg-blue-200 border-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border-blue-900 ': color == 'blue',
            'bg-gray-100 hover:bg-gray-200 border-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:border-gray-800 ': color == 'gray',
            '!rounded-md': isSquare,
        }">
        <component class="w-6 h-6 stroke-2 transition duration-75" :is="icon" :class="{
            'fill-red-700 hover:fill-red-800 dark:fill-red-100': color == 'red',
            'fill-green-700 hover:fill-green-800 dark:fill-green-100': color == 'green',
            'fill-blue-700 hover:fill-blue-800 dark:fill-blue-100': color == 'blue',
            'fill-gray-600 hover:fill-gray-700 dark:fill-gray-100': color == 'gray',
        }"></component>
        <slot />
    </button>
</template>