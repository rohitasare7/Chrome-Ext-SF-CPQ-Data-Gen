<script setup>
/*global chrome*/

import { ref, onMounted } from "vue";
import { sfConn } from "@/assets/helper";
import { extractValue, addToast } from "@/assets/globalUtil";

import { getActionByName } from "@/assets/sfdcActions";
import { getAccountCompositeRequest, getCreateOrderRequest, getAddItemsToCartRequest, getCustomerInteractionReq } from "@/assets/cpqActions";

import GuidedFlow from "../elements/GuidedFlow.vue";
import PrimaryButton from "../elements/PrimaryButton.vue";
import TextInput from "../elements/TextInput.vue";
import LoadingCircle from "../elements/LoadingCircle.vue";
import TextDesc from "../elements/TextDesc.vue";
import PageDescription from "../elements/PageDescription.vue";
import PageTitle from "../elements/PageTitle.vue";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Vue3 Easy DataTable
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
//faker
import { faker } from '@faker-js/faker/locale/en_AU';
//icons
import { CheckIcon, UserCircleIcon, ShoppingCartIcon, SquaresPlusIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid';

const sfHostURL = ref('');
const orgIdentifier = ref('');
const pageTitle = 'CPQ Test Data Generator';

const hitSFIAPI = (sfdcAction, reqBody, recordId, method) => {
  console.log('inside');
  let url;
  const sfdcActionItem = getActionByName(sfdcAction);
  console.log('sfdcActionItem --> ' + sfdcActionItem.uri);
  if (recordId) {
    url = sfdcActionItem.uri.replace('<RecordId>', recordId);
  }
  else {
    url = sfdcActionItem.uri;
  }
  const obj = {
    method: method ?? 'GET', // Use POST method for creating
    body: reqBody ? reqBody : {}, // Pass the payload
  }
  console.log('post req body --> ' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    sfConn
      .getSession(sfHostURL.value)
      .then(() => {
        // console.log("getSession inside");
        let limitsPromise = sfConn.rest(url, obj);
        limitsPromise
          .then((data) => {
            //console.log('limitsPromise data --> ', data);
            resolve(data); // Resolve the promise with the fetched data
          })
          .catch((error) => {
            console.error("Error fetching limits: ", error);
            reject(error); // Reject the promise if there is an error
          });
      })
      .catch((error) => {
        console.error("Error getting session: ", error);
        reject(error); // Reject the promise if there is an error getting the session
      });
  });
};

//product table vars
const searchField = ['Product2.ProductCode', 'Name', 'Product2.vlocity_cmt__Type__c', 'Product2.vlocity_cmt__SubType__c'];
const searchValue = ref('');

// const sortBy = "StartTime";
// const sortType = "desc";

const headers = [
  { text: "Action", value: "Actions", width: 130 },
  { text: "Name", value: "Name", width: 250 },
  { text: "Type", value: "Product2.vlocity_cmt__Type__c", width: 150, sortable: true }, //width: 200
  { text: "Sub Type", value: "Product2.vlocity_cmt__SubType__c", width: 100, sortable: true },
  { text: "Product Code", value: "Product2ProductCode", width: 200 },
  { text: "Family", value: "Product2.Family", width: 100, sortable: true },
];

const selectedTableHeaders = [
  { text: "Product Name", value: "Name" },
  { text: "Quantity", value: "fieldsToUpdate.quantity" },
];

const catalogList = ref(['']);
const productList = ref([]);
const priceList = ref([]);
const selectedCatalog = ref('');
const selectedPriceList = ref('');
const selectedStage = ref('random_data');
const accRecordTypes = ref('');
const fakerData = ref(null);
const isOrderSubmitted = ref(false);
//loading button vars
const isAccountBtnLoading = ref(false);
const isCreateOrderBtnLoading = ref(false);
const isAddToCartBtnLoading = ref(false);
const isSubmitOrderBtnLoading = ref(false);
const isInitDataLoaded = ref(false);
const oneClickStatus = ref(null);
const isOneClickBtnLoading = ref(false);
const isCustInteractionBtnLoading = ref(false);
//Created Data
const createdAccList = ref([]);
const orderId = ref('');
const orderNumber = ref('');
const selectedProductList = ref([]);

const stages = ref([
  { id: 'random_data', title: 'Random Data', description: 'Check/Refresh and Insert Records', icon: UserCircleIcon, completed: false },
  { id: 'create_order', title: 'Create Order', description: 'Create order with above SA Account.', icon: ShoppingCartIcon, completed: false },
  { id: 'add_to_cart', title: 'Add to Cart', description: 'Add products to Order', icon: SquaresPlusIcon, completed: false },
  { id: 'submit_order', title: 'Checkout', description: 'Submit your order for activation', icon: PaperAirplaneIcon, completed: false }
]);

const setSelectedStage = (stageId) => {
  selectedStage.value = stageId
}

const updateStageCompletion = (stageId) => {
  const stage = stages.value.find(s => s.id === stageId)
  if (stage) {
    stage.completed = true;
  }
}

const getCatalogList = async () => {
  try {
    const response = await hitSFIAPI('Query_GetCatalogCode', null, null, 'GET');
    // console.log('response --> ' + JSON.stringify(response));
    catalogList.value = response?.records.map(record => record.vlocity_cmt__CatalogCode__c);
    // console.log('response --> ' + JSON.stringify(catalogList.value));
  }
  catch (error) {
    console.log('error --> ' + error);
  }
}

const getAccountRecordType = async () => {
  try {
    const response = await hitSFIAPI('Query_AccountRecordType', null, null, 'GET');
    // console.log('response --> ' + JSON.stringify(response));
    accRecordTypes.value = response?.records.map(record => ({
      Id: record.Id,
      Name: record.Name
    }));
    // console.log('accRecordTypes --> ' + JSON.stringify(accRecordTypes.value));
  }
  catch (error) {
    console.log('error --> ' + error);
    isInitDataLoaded.value = false;
    addToast('getAccountRecordType failed, check dev console', 'Error');
  }
}

const getRecTypeIdByName = (name) => {
  const record = accRecordTypes.value.find(record => record.Name === name);
  return record ? record.Id : null;
};

//Generate Faker Data
const generateFakerData = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  fakerData.value = {
    firstName,
    lastName,
    fullName: firstName + ' ' + lastName,
    phone: faker.phone.number(),
    BillingCity: faker.location.city(),
    BillingCountry: 'Australia', //faker.location.country()
    BillingPostalCode: faker.location.zipCode('#####'),
    BillingState: faker.location.state(),
    BillingStreet: faker.location.streetAddress(true),
    vlocity_cmt__SubscriptionNumber__c: faker.helpers.fromRegExp(/[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/),
    vlocity_cmt__ServiceIdentifier__c: faker.helpers.fromRegExp(/[0-9]{10}/),
    AccountNumbers: {
      SA: faker.helpers.fromRegExp(/[0-9]{4}/),
      BA: faker.helpers.fromRegExp(/[0-9]{4}/),
      CA: faker.helpers.fromRegExp(/[0-9]{4}/)
    },
    AccountNumber: faker.helpers.fromRegExp(/[0-9]{6}/),
    vlocity_cmt__BillingEmailAddress__c: faker.internet.email({ provider: 'test.com' }),
  };
}

//add error handling
const createAccountRecords = async () => {
  isAccountBtnLoading.value = true;
  try {
    const params = {
      recordTypeSA: getRecTypeIdByName('Service'),
      recordTypeBA: getRecTypeIdByName('Billing'),
      recordTypeCA: getRecTypeIdByName('Consumer'),
      startDate: new Date().toJSON(),
      faker: fakerData.value
    };
    const reqStr = getAccountCompositeRequest(params);
    console.log('reqStr --> ' + JSON.stringify(reqStr));
    //Create SA,BA,CA
    const response = await hitSFIAPI('CRUD_CompositeAPI', reqStr, null, 'POST');
    console.log('createAccountRecords --> ' + JSON.stringify(response));
    //Check errors
    const checkStatus = getHttpStatusCode('refAccountSA', response.compositeResponse);
    if (checkStatus == 400) {
      addToast('Something failed, please check console.', 'Error');
    }
    else {
      createdAccList.value = response.compositeResponse.map(response => {
        return { refId: response.referenceId, id: response.body.id };
      });
      addToast('Accounts, Contact and Subscription records are created.', 'Success');
      updateStageCompletion('random_data');
    }
  }
  catch (error) {
    addToast('Something failed, please check console.', 'Error');
    console.log('error --> ' + error);
  }
  isAccountBtnLoading.value = false;
}

//Accepted params refAccountCA, refAccountBA, refAccountSA, refSubscription
const getIdByReferenceId = (referenceId) => {
  const record = createdAccList.value.find(item => item.refId === referenceId);
  return record ? record.id : null;
};

const getHttpStatusCode = (referenceId, compositeResponse) => {
  const record = compositeResponse.find(item => item.referenceId === referenceId);
  return record ? record.httpStatusCode : null;
};

//Create Blank Order
const createOrder = async () => {
  isCreateOrderBtnLoading.value = true;
  const serviceAccId = getIdByReferenceId('refAccountSA');
  if (serviceAccId == null) {
    addToast('Please create Accounts and related data first', 'Error');
    selectedStage.value = 'random_data';
    isCreateOrderBtnLoading.value = false;
    return;
  }
  try {
    const params = {
      accId: serviceAccId,
      priceListId: selectedPriceList.value
    }
    const reqStr = getCreateOrderRequest(params);
    console.log('createOrder reqStr --> ' + JSON.stringify(reqStr));
    const response = await hitSFIAPI('CPQ_CreateCart', reqStr, null, 'POST');
    console.log('createOrder --> ' + JSON.stringify(response));
    if (response.records.length > 0) {
      orderId.value = response.records[0].Id;
      orderNumber.value = response.records[0].OrderNumber;
      updateStageCompletion('create_order');
      addToast('Order has been created : ' + orderNumber.value, 'Sucess');
    }
    else {
      console.log('No order found.');
      addToast('No order found.', 'Error');
    }
  }
  catch (error) {
    console.log('error --> ' + error);
    addToast('Something has failed, please check dev console.', 'Error');
  }
  isCreateOrderBtnLoading.value = false;

}

// Get products to add to cart
const getPriceList = async () => {
  try {
    const response = await hitSFIAPI('Query_PriceList', null, null, 'GET');
    // console.log('response --> ' + JSON.stringify(response));
    priceList.value = response?.records.map(record => ({
      Id: record.Id,
      Name: record.Name
    }));
    selectedPriceList.value = priceList.value[0].Id;
    console.log('getPriceList --> ' + JSON.stringify(priceList.value));
  }
  catch (error) {
    addToast('getPriceList failed, check dev console', 'Error');
    console.log('error --> ' + error);
    isInitDataLoaded.value = false;
  }
}

// Get products to add to cart
const getProductList = async () => {
  try {
    const response = await hitSFIAPI('Query_PriceBookEntryList', null, null, 'GET');
    // console.log('response --> ' + JSON.stringify(response));
    // productList.value = response?.records;
    productList.value = response?.records.map(item => ({ ...item, isChecked: false }));
    console.log('productList --> ' + JSON.stringify(productList.value));
  }
  catch (error) {
    console.log('error --> ' + error);
    isInitDataLoaded.value = false;
    addToast('getProductList failed, check dev console', 'Error');
  }
}

//Handle product actions
const addItem = (Name, itemId, parentId, fieldsToUpdate) => {
  const newItem = {
    Name,
    itemId,
    parentId,
    fieldsToUpdate
  };
  selectedProductList.value.push(newItem);

  const item = productList.value.find(item => item.Id === itemId);
  if (item) {
    item.isChecked = true;
  }
};

const removeItem = (itemId) => {
  selectedProductList.value = selectedProductList.value.filter(item => item.itemId !== itemId);
  const item = productList.value.find(item => item.Id === itemId);
  if (item) {
    item.isChecked = false;
  }
};

const resetSelectedProducts = () => {
  selectedProductList.value = [];
  productList.value = productList.value.map(item => ({ ...item, isChecked: false }));
}

const toggleProductInList = (itemId, Name, isChecked) => {
  console.log('inside' + itemId + ' | ' + Name + '  |  ' + isChecked);
  if (isChecked) {
    addItem(Name, itemId, itemId, { quantity: 1 }); // Default quantity is 1
  } else {
    removeItem(itemId);
  }
};

const updateProductQuantity = (itemId, quantity) => {
  const item = selectedProductList.value.find(item => item.itemId === itemId);
  if (item) {
    item.fieldsToUpdate.quantity = quantity;
  }
};

// Add items to cart
const addItemsToCart = async () => {
  if (selectedProductList.value.length == 0) {
    addToast('Please add items to cart.', 'Error');
    return;
  }
  else if (orderId.value == '') {
    selectedStage.value = 'create_order';
    addToast('Please create order first.', 'Error');
    return;
  }
  isAddToCartBtnLoading.value = true;
  try {
    const itemsArray = [
      {
        itemId: selectedProductList.value
          .map(({ itemId }) => itemId) // Extract itemId values
          .join(','), // Join with comma
        fieldsToUpdate: selectedProductList.value.reduce((acc, { fieldsToUpdate }) => {
          return { ...acc, ...fieldsToUpdate }; // Combine fieldsToUpdate from all items
        }, {})
      }
    ];
    const params = {
      cartId: orderId.value,
      itemsArray
    }
    const reqStr = getAddItemsToCartRequest(params);
    console.log('addItemsToCart reqStr --> ' + JSON.stringify(reqStr));
    const response = await hitSFIAPI('CPQ_AddItemsToCart', reqStr, orderId.value, 'POST');
    console.log('addItemsToCart response --> ' + JSON.stringify(response));
    updateStageCompletion('add_to_cart');
    addToast('Selected Items added to cart.', 'Sucess');
  }
  catch (error) {
    console.log('error --> ' + error);
    addToast('Something has failed, please check dev console.', 'Error');
  }
  isAddToCartBtnLoading.value = false;
}

//Submit Order
const checkoutOrder = async () => {
  if (orderId.value == '') {
    selectedStage.value = 'create_order';
    addToast('Please create order first and add items as well.', 'Error');
    return;
  }
  isSubmitOrderBtnLoading.value = true;
  try {
    const params = {
    }
    const response = await hitSFIAPI('CPQ_CheckoutOrder', params, orderId.value, 'POST');
    console.log('checkoutOrder --> ' + JSON.stringify(response));
    updateStageCompletion('submit_order');
    addToast('Order submitted successfully.', 'Success');
    isOrderSubmitted.value = true;
  }
  catch (error) {
    console.log('error --> ' + error);
    addToast('Something has failed, please check dev console.', 'Error');
  }
  isSubmitOrderBtnLoading.value = false;
}

/*
After Order Creation Patching Data
*/

//Create Customer Interaction (Optional)
const createInteraction = async () => {
  isCustInteractionBtnLoading.value = true;
  try {
    const params = {
      recordTypeSA: getIdByReferenceId('refAccountSA'),
      fullName: fakerData.value.fullName,
    };
    const reqStr = getCustomerInteractionReq(params);
    console.log('createInteraction reqStr --> ' + JSON.stringify(reqStr));
    const response = await hitSFIAPI('CRUD_CompositeAPI', reqStr, null, 'POST');
    console.log('createInteraction response --> ' + JSON.stringify(response));
    addToast('Customer Interaction Record created.', 'Sucess');
  }
  catch (error) {
    console.log('error --> ' + error);
    addToast('Something has failed, please check dev console.', 'Error');
  }
  isCustInteractionBtnLoading.value = false;
}

const resetStages = () => {
  stages.value.forEach(stage => {
    stage.completed = false
  });
}

//reset all data
const resetData = () => {
  generateFakerData();
  resetStages();
  createdAccList.value = [];
  selectedProductList.value = [];
  orderId.value = '';
  orderNumber.value = '';
  isOrderSubmitted.value = false;
  selectedStage.value = 'random_data';
}

//Creates all records in 1 click
const oneClickAutomation = async () => {
  if (selectedProductList.value.length == 0) {
    addToast('Please select some products from Add to cart page.', 'Error');
    selectedStage.value = 'add_to_cart';
    return;
  }
  else {
    try {
      isOneClickBtnLoading.value = true;
      oneClickStatus.value = 'Creating Accounts..';
      await createAccountRecords();
      oneClickStatus.value = 'Creating Order..';
      await createOrder();
      oneClickStatus.value = 'Adding items to Order..';
      await addItemsToCart();
      oneClickStatus.value = 'Submitting Order..';
      await checkoutOrder();
      oneClickStatus.value = null;
      isOneClickBtnLoading.value = false;
    }
    catch (error) {
      oneClickStatus.value = null;
      isOneClickBtnLoading.value = false;
      console.log('error --> ' + error);
      addToast('Something failed, please check dev console', 'Error');
    }
  }
  addToast('All data has been created successfully, Order Number : ' + orderNumber.value, 'Success');
  selectedStage.value = 'submit_order';
}

// Init all data required
const initData = async () => {
  isInitDataLoaded.value = true;
  await getAccountRecordType();
  await getPriceList();
  await getProductList();
  isInitDataLoaded.value = false;
}

//On page load
onMounted(async () => {
  let args = new URLSearchParams(location.search.slice(1));
  let sfHost = args.get("host");
  sfHostURL.value = sfHost;
  orgIdentifier.value = extractValue(`https://${sfHostURL.value}`);
  document.title = pageTitle;
  generateFakerData();
  await initData();
});

/*
// To do
1. [Done] Add interaction : [Pending] Add Optional check on UI
2. [Done] Contact otherPhone
3. Assets, Order Products --> Subscription Mapping
4. Create Contract --> Subscrption/order : [Pending] Add Optional check on UI
*/
</script>

<template>
  <!-- Init Main Page -->
  <TextDesc v-if="sfHostURL" class="mt-2 mb-4">Current Org : {{ sfHostURL }}</TextDesc>

  <div class="flex justify-center text-center">
    <div class="flex flex-col">
      <PageTitle>Test Data Generator</PageTitle>
      <PageDescription>Create dummy accounts, order, add products from pricelist and submit order.</PageDescription>
      <div>
        <PrimaryButton @click="oneClickAutomation">
          <LoadingCircle v-if="isOneClickBtnLoading" :cssStyle="'h-4 w-4 mr-2'"> {{ oneClickStatus ?? 'Loading..' }}
          </LoadingCircle>
          <p v-else>One Click Create</p>
        </PrimaryButton>
      </div>
    </div>
  </div>


  <div class="container mx-auto">
    <div class="flex flex-row flex-wrap py-4">
      <aside class="w-full sm:w-1/3 md:w-1/6 px-2">
        <div class="sticky top-0 p-4 w-full">
          <ol class="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <GuidedFlow v-for="(stage, index) in stages" :key="index" :stage="stage" :selectedStage="selectedStage"
              @stageSelected="setSelectedStage" />
          </ol>
        </div>
      </aside>
      <main role="main" class="w-full sm:w-2/3 md:w-4/5 pt-1 px-2">
        <!-- 1st Block - Random Data -->
        <div v-if="selectedStage == 'random_data'"
          class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div class="w-full mr-3 lg:w-4/6">
            <InputLabel value="Random Dummy Data" />
            <div class="relative overflow-x-auto sm:rounded-lg w-full mt-2 border dark:border-gray-700">
              <table class="w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-400">
                <thead
                  class="text-xs text-gray-700 uppercase border-b dark:border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      Item
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in fakerData" :key="key"
                    class="bg-white dark:bg-gray-900 border-b dark:border-gray-700/80">
                    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-gray-500">
                      {{ key }}
                    </th>
                    <td class="px-6 py-2">
                      {{ value }}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
          <div class="w-full mr-3 lg:w-2/6">
            <InputLabel value="Actions" />
            <div class="block w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 mt-2 mb-4 p-4 rounded-md border">
              <PrimaryButton class="" @click="generateFakerData">Refresh Data</PrimaryButton>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-4">You can generate virtually unlimited data by
                clicking above Refresh Button (It will not insert records in Salesforce)</p>
            </div>

            <div class="block w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 mt-2 mb-4 p-4 rounded-md border">
              <PrimaryButton class="" @click="createAccountRecords">
                <LoadingCircle v-if="isAccountBtnLoading" :cssStyle="'h-4 w-4 mr-2'">Creating data...</LoadingCircle>
                <LoadingCircle v-else-if="isInitDataLoaded" :cssStyle="'h-4 w-4 mr-2'">Initializing required data...
                </LoadingCircle>
                <p v-else>Create Accounts</p>
              </PrimaryButton>
              <p v-if="createdAccList.length == 0" class="text-sm text-gray-600 dark:text-gray-300 mt-4">Click above
                button to create records for <br />Consumer Account > Billing Account > Service Account (as Hierarchy)
                along with Contact and
                Subscription.</p>
              <p v-if="createdAccList.length > 0" class="text-sm text-gray-600 dark:text-gray-300 mt-4">You can access
                CA, BA, SA, Contact and Subscription from below links.</p>

              <div v-if="createdAccList.length > 0">
                <a :href="`https://${sfHostURL}/${getIdByReferenceId('refAccountCA')}`" target="_blank"
                  class="text-blue-700 dark:text-blue-100  hover:text-blue-800 font-semibold text-sm mb-2 mt-4 block w-full">
                  Consumer Account</a>
                <a :href="`https://${sfHostURL}/${getIdByReferenceId('refAccountBA')}`" target="_blank"
                  class="text-blue-700 dark:text-blue-100  hover:text-blue-800 font-semibold text-sm mb-2 block w-full">
                  Billing Account</a>
                <a :href="`https://${sfHostURL}/${getIdByReferenceId('refAccountSA')}`" target="_blank"
                  class="text-blue-700 dark:text-blue-100  hover:text-blue-800 font-semibold text-sm mb-2 block w-full">
                  Service Account</a>
                <a :href="`https://${sfHostURL}/${getIdByReferenceId('refContact')}`" target="_blank"
                  class="text-blue-700 dark:text-blue-100  hover:text-blue-800 font-semibold text-sm mb-2 block w-full">
                  Contact</a>
                <a :href="`https://${sfHostURL}/${getIdByReferenceId('refSubscription')}`" target="_blank"
                  class="text-blue-700 dark:text-blue-100  hover:text-blue-800 font-semibold text-sm mb-2 block w-full">
                  Subscription</a>
              </div>

            </div>

          </div>
        </div>

        <!-- 2nd Block - Create Order -->
        <div v-if="selectedStage == 'create_order'"
          class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div class="w-full mr-3 lg:w-4/6">

            <InputLabel value="Select PriceList" class="text-sm font-normal" />
            <vSelect label="Name" :options="priceList" v-model="selectedPriceList" :reduce="Name => Name.Id"
              class="w-3/6 my-2 mr-4">
            </vSelect>

            <div v-if="orderId"
              class="block w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 my-4 p-4 rounded-md border">
              <p class="text-sm text-gray-600 dark:text-gray-300">New order created : {{ orderNumber }}</p>
              <a :href="`https://${sfHostURL}/${orderId}`" target="_blank"
                class="text-blue-700 dark:text-blue-100  hover:text-blue-800 font-semibold text-sm mb-2 mt-4 block w-full">
                {{ orderId }}</a>
            </div>

          </div>
          <div class="w-full mr-3 lg:w-2/6">
            <InputLabel value="Actions" />
            <div class="block w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 mt-2 mb-4 p-4 rounded-md border">
              <PrimaryButton class="mr-2" @click="createOrder">
                <LoadingCircle v-if="isCreateOrderBtnLoading" :cssStyle="'h-4 w-4 mr-2'">Creating order...
                </LoadingCircle>
                <p v-else>Create Order</p>
              </PrimaryButton>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-4">Once your accounts are created, you can proceed
                to create order and then add items later.</p>
            </div>
          </div>
        </div>

        <!-- 3rd Block - Add To Cart -->
        <div class="relative overflow-visible" v-else-if="selectedStage == 'add_to_cart'">

          <div v-if="productList.length > 0">
            <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div class="w-full mr-3 lg:w-4/6">
                <InputLabel value="Product List (from PricebookEntry)" />
                <div class="flex items-start justify-items-center">

                  <TextInput v-model="searchValue" type="text" class="my-4 mr-4 !px-2 !py-1"
                    placeholder="Search any product.." />
                </div>

                <Vue3EasyDataTable :headers="headers" :items="productList" :search-field="searchField"
                  :rows-per-page="12" header-text-direction="center" :search-value="searchValue" :no-hover="true"
                  :theme-color="'#312e3d'"
                  table-class-name="tableCSS mb-12 rounded-lg border dark:border-gray-700 shadow-md">
                  <template #item-Actions="{ Id, Name, isChecked }">
                    <TextInput type="checkbox" class="my-2 ml-2 mr-2 cursor-pointer"
                      @change="toggleProductInList(Id, Name, $event.target.checked)" :checked="isChecked" />
                    <TextInput type="number" class="my-2 !px-2 !py-1 !w-20 text-xs" placeholder="Quantity"
                      @change="updateProductQuantity(Id, $event.target.value)" />
                  </template>
                  <template #item-Product2ProductCode="{ Product2 }">
                    {{ Product2.ProductCode }}
                  </template>
                </Vue3EasyDataTable>
              </div>

              <div class="w-full mr-3 lg:w-2/6" v-if="selectedProductList.length > 0">
                <InputLabel value="Selected Products" />
                <PrimaryButton class="mr-2 my-4" @click="addItemsToCart">
                  <LoadingCircle v-if="isAddToCartBtnLoading" :cssStyle="'h-4 w-4 mr-2'">Adding items...</LoadingCircle>
                  <p v-else>Add Items to Cart</p>
                </PrimaryButton>
                <PrimaryButton class="mr-2 my-4" :isRed=true @click="resetSelectedProducts">Reset</PrimaryButton>
                <Vue3EasyDataTable :headers="selectedTableHeaders" :items="selectedProductList"
                  :search-field="searchField" :rows-per-page="12" header-text-direction="center"
                  :search-value="searchValue" :no-hover="true" :theme-color="'#312e3d'"
                  table-class-name="tableCSS mb-12 rounded-lg border dark:border-gray-700 shadow-md">
                </Vue3EasyDataTable>
              </div>

            </div>
          </div>
          <div v-else>
            <PrimaryButton class="mr-2 my-4">
              <LoadingCircle :cssStyle="'h-4 w-4 mr-2'">Products are loading... </LoadingCircle>
            </PrimaryButton>
          </div>
        </div>

        <!-- 4th Block - Submit Order -->
        <div v-if="selectedStage == 'submit_order'"
          class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div class="w-full mr-3 lg:w-4/6">
            <div v-if="isOrderSubmitted"
              class="block w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 my-4 p-4 rounded-md border">
              <p class="text-sm text-gray-600 dark:text-gray-300">Order : {{ orderNumber }} has been submitted, you can
                check it
                in your org by visiting below link for further fulfilment..</p>
              <a :href="`https://${sfHostURL}/${orderId}`" target="_blank"
                class="text-blue-700 dark:text-blue-100  hover:text-blue-800 font-semibold text-sm mb-2 mt-4 block w-full">
                Open Order in SF</a>
            </div>
            <div class="w-full mr-3 lg:w-1/2" v-if="selectedProductList.length > 0">
              <InputLabel :value="orderNumber ? 'Selected Products for Order : ' + orderNumber : 'Selected Products'"
                class="mb-2" />
              <Vue3EasyDataTable :headers="selectedTableHeaders" :items="selectedProductList"
                :search-field="searchField" :rows-per-page="12" header-text-direction="center"
                :search-value="searchValue" :no-hover="true" :theme-color="'#312e3d'"
                table-class-name="tableCSS mb-12 rounded-lg border dark:border-gray-700 shadow-md">
              </Vue3EasyDataTable>
            </div>
          </div>
          <div class="w-full mr-3 lg:w-2/6">
            <div v-if="!isOrderSubmitted"
              class="block w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 mt-2 mb-4 p-4 rounded-md border">
              <PrimaryButton @click="checkoutOrder">
                <LoadingCircle v-if="isSubmitOrderBtnLoading" :cssStyle="'h-4 w-4 mr-2'">Submitting Order...
                </LoadingCircle>
                <p v-else>Checkout Order</p>
              </PrimaryButton>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-4">After adding your products to cart/order, you can
                finally
                submit the order for fulfilment.</p>
            </div>
            <div v-else>

              <PrimaryButton @click="resetData">
                Restart Flow
              </PrimaryButton>

            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

</template>

<script>
export default {
  name: "indexComp",
};
</script>
