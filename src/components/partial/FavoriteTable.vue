<script setup>

import { ref, onMounted, watch, defineEmits } from "vue";
import { fetchRecords, deleteRecord } from "@/assets/storageUtil";
import { extractValue, getSalesforceURL } from "@/assets/globalUtil";
import TextInput from "../elements/TextInput.vue";
import PrimaryHeading from "../elements/PrimaryHeading.vue";
import TextDesc from "../elements/TextDesc.vue";
import PrimaryButton from "../elements/PrimaryButton.vue";
import Icon_Delete from "@/assets/icons/Icon_Delete.vue";
import SVGIconButton from "../elements/SVGIconButton.vue";

// Vue3 Easy DataTable
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const emit = defineEmits(["fireEvent"]);

const props = defineProps({
    sfHost: String,
    currenObject: String,
});

const recordList = ref([]);
const itemList = ref([]);

const searchField = ref(["name"]);
const searchValue = ref("");
const sortBy = ref("LastModifiedDate");
const sortType = "desc";

const tableHeaders = ref([
    { text: "Id", value: "id" },
    { text: "Name", value: "name", sortable: true },
    { text: "Actions", value: "Actions", width: 300 },
]);

const recordTitle = ref('');
const dataLoading = ref(false);
const sfHostURL = ref(props?.sfHost ?? '');
const queriedObject = ref('');
const orgIdentifier = ref('');

const getCurrentObject = () => {
    queriedObject.value = props?.currenObject;
    // console.log('queriedObject --> ' + queriedObject.value);
}

const filterItemsByType = async (setDelay = false) => {
    // Fetch records after a delay of 3 seconds
    if (setDelay) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // Fetch records
    recordList.value = await fetchRecords(props?.sfHost);
    getCurrentObject();
    itemList.value = [];
    for (const record of recordList.value) {
        if (record.type === props?.currenObject) {
            itemList.value.push(...record.items);
        }
    }
    // console.log('inside filterItemsByType and obj --> ' + props?.currenObject);
    // console.log('itemList --> ' + JSON.stringify(itemList.value));
    return itemList;
};

const removeItemById = async (id) => {
    let result = await deleteRecord(id, props?.sfHost);
    if (result) {
        itemList.value = itemList.value.filter(item => item.id !== id);
        emit('fireEvent', { action: 'deleteItem', recId: id });
        // console.log('Item with ID', id, 'removed from itemList');
    }

};

const getLatestFavItemList = async () => {
    await filterItemsByType(true);
    // console.log('inside getLatestFavItemList');
}

watch(() => props.currenObject, async (newValue) => {
    if (newValue) {
        // console.log('inside watch');
        await filterItemsByType(false);
    }
}, { immediate: true }); // Call immediately when the component is created

onMounted(async () => {
    //console.log('sfHost --> ' + props?.sfHost);
    recordList.value = await fetchRecords(props?.sfHost);
    //console.log('recordList.value --> ' + JSON.stringify(recordList.value));
    queriedObject.value = props?.currenObject;
    //console.log('queriedObject --> ' + queriedObject.value);
    getCurrentObject();
    orgIdentifier.value = extractValue(`https://${props?.sfHost}`);
});

defineExpose({
    getLatestFavItemList
})
</script>

<template>
    <div v-if="dataLoading">
        <PrimaryButton>
            <LoadingCircle :cssStyle="'h-4 w-4 mr-2'">Data is loading...</LoadingCircle>
        </PrimaryButton>
    </div>
    <div v-else>
        <div class="mt-4 mb-2" v-if="itemList.length > 0">
            <!-- <SVGIconButton @click="filterItemsByType" :icon="Icon_Favorite" :isSquare="false"
            :color="'gray'" class="!p-1.5" title="Add to Favorite" /> -->
            <PrimaryHeading>Favorite Records for <span class="text-blue-600 dark:text-blue-400">{{ props?.currenObject }}</span>
            </PrimaryHeading>
            <TextDesc>Please note, there might be newer versions so please refer latest data from above table.
            </TextDesc>
        </div>
        <div v-if="itemList.length > 0">
            <TextInput v-model="searchValue" type="text" class="!px-2 !py-1 my-2" placeholder="Filter records.." />
            <Vue3EasyDataTable :headers="tableHeaders" :items="itemList" :search-field="searchField" :rows-per-page="10"
                header-text-direction="center" body-text-direction="center" :search-value="searchValue"
                :sort-by="sortBy" :sort-type="sortType" :no-hover="true" :theme-color="'#312e3d'"
                table-class-name="tableCSS mt-4 mb-8 rounded-lg border dark:border-gray-600 shadow-md">
                <template #loading>
                    <TextDesc class="font-semibold my-4">Data loading, please wait...</TextDesc>
                </template>
                <template #item-Name="{ name }">
                    <p class="text-left ml-2">{{ name }}</p>
                </template>
                <template #item-Actions="{ id }">
                    <div class="flex justify-center text-center items-center my-1.5">
                        <a :href="getSalesforceURL(orgIdentifier, props?.sfHost, id, props?.currenObject)"
                            target="_blank">
                            <PrimaryButton>Open in SF</PrimaryButton>
                        </a>
                        <SVGIconButton @click="removeItemById(id)" :icon="Icon_Delete" :isSquare="false" :color="'red'"
                            class="!p-1.5 ml-2 " title="Remove from Favorite" />
                    </div>
                </template>
            </Vue3EasyDataTable>
        </div>
    </div>
</template>

<script>
export default {
    name: "favoriteTableComp",
};
</script>
