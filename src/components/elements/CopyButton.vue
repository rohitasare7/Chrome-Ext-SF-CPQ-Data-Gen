<script setup>
import { ref, defineProps } from 'vue';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline';
import { addToast } from "@/assets/globalUtil";

const props = defineProps(['copyValue', 'label']);
const copyToClipboard = () => {
    navigator.clipboard.writeText(props.copyValue)
        .then(() => {
            const message = props.label ? `${props.label} value copied to Clipboard.` : 'Value copied to Clipboard.';
            addToast(message, 'Success');
        })
        .catch((err) => {
            console.error('Error copying to clipboard:', err);
            addToast('Error copying to clipboard, check dev console.', 'Error');
        });
};
</script>

<template>
    <button @click="copyToClipboard">
        <DocumentDuplicateIcon class="h-4 w-4 text-gray-500 dark:text-gray-100 mr-2" />
    </button>
</template>
