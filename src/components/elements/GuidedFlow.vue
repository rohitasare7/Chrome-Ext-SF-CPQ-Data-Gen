<template>
    <li class="mb-10 ms-6 cursor-pointer" @click="selectStage">
        <span class="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 " :class="[
            stage.completed ? 'bg-green-200 dark:bg-green-900' : '',
            !stage.completed && selectedStage === stage.id ? 'bg-blue-300' : '',
            !stage.completed && selectedStage !== stage.id ? 'bg-gray-100 dark:bg-gray-700' : ''
        ]">
            <component :is="stage.icon" class="w-5 h-5" :class="[
                stage.completed ? 'text-green-600 dark:text-green-400' : '',
                !stage.completed && selectedStage === stage.id ? 'text-blue-600' : '',
                !stage.completed && selectedStage !== stage.id ? 'text-gray-500 dark:text-gray-400' : ''
            ]" />
        </span>
        <h3 class="font-medium leading-tight"
            :class="selectedStage === stage.id ? 'font-semibold text-gray-700 dark:text-gray-300' : ''">{{ stage.title
            }}
        </h3>
        <p class="text-sm">{{ stage.description }}</p>
    </li>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// const props = defineProps<{ stage, selectedStage }>()
const props = defineProps({
    stage: {
        type: Object,
    },
    selectedStage: {
        type: String,
    }
});

const emit = defineEmits(['stageSelected'])

const selectStage = () => {
    emit('stageSelected', props.stage.id)
}
</script>