<script setup>
import ToastListItem from './ToastListItem.vue';
import toast from '@/assets/toast';

function remove(index) {
    toast.remove(index);
}

</script>
<template>
    <TransitionGroup tag="div" enter-from-class="translate-x-full opacity-0"
        enter-active-class="transition-all duration-500" leave-active-class="transition-all duration-500"
        leave-to-class="translate-x-full opacity-0" move-class="transform transition-all duration-500"
        class="fixed top-8 right-8 z-90 w-full max-w-xs space-y-4 toastList">
        <ToastListItem v-for="(item, index) in toast.items" :key="item.key" :message="item.message" :type="item.type"
            :duration="5500" @remove="remove(index)" class="transform transition-all duration-500" />
    </TransitionGroup>
</template>

<style>
.toastList {
    z-index: 999;
}
</style>