// const apiVersion = 61.0
import { apiVersion } from "./helper";
/*
Fields to add --> Acc : Type, SA : ShippingAddress, industry, account site, SLA, Customer Priority, Contact preference
*/
//Create contact also
const getAccountCompositeRequest = (params) => {
    const requestStr = {
        "compositeRequest": [
            {
                "method": "POST",
                "url": `/services/data/v${apiVersion}/sobjects/Account`,
                "referenceId": "refAccountCA",
                "body": {
                    "Name": `CA ${params.faker.fullName} ${Math.floor(Math.random() * 10)}`,
                    "RecordTypeId": `${params.recordTypeCA}`,
                    "vlocity_cmt__Status__c": "Active",
                    "Phone": `${params.faker.phone}`,
                    "BillingCity": `${params.faker.BillingCity}`,
                    "BillingCountry": `${params.faker.BillingCountry}`,
                    "BillingPostalCode": `${params.faker.BillingPostalCode}`,
                    "BillingState": `${params.faker.BillingState}`,
                    "BillingStreet": `${params.faker.BillingStreet}`,
                    "vlocity_cmt__Active__c": "Yes"
                }
            },
            {
                "method": "POST",
                "url": `/services/data/v${apiVersion}/sobjects/Account`,
                "referenceId": "refAccountBA",
                "body": {
                    "Name": `BA ${params.faker.fullName} ${Math.floor(Math.random() * 10)}`,
                    "RecordTypeId": `${params.recordTypeBA}`,
                    "vlocity_cmt__Status__c": "Active",
                    "Phone": `${params.faker.phone}`,
                    "BillingCity": `${params.faker.BillingCity}`,
                    "BillingCountry": `${params.faker.BillingCountry}`,
                    "BillingPostalCode": `${params.faker.BillingPostalCode}`,
                    "BillingState": `${params.faker.BillingState}`,
                    "BillingStreet": `${params.faker.BillingStreet}`,
                    "vlocity_cmt__Active__c": "Yes",
                    "ParentId": "@{refAccountCA.id}"
                }
            },
            {
                "method": "POST",
                "url": `/services/data/v${apiVersion}/sobjects/Account`,
                "referenceId": "refAccountSA",
                "body": {
                    "Name": `SA ${params.faker.fullName} ${Math.floor(Math.random() * 10)}`,
                    "RecordTypeId": `${params.recordTypeSA}`,
                    "vlocity_cmt__Status__c": "Active",  // add options later
                    "Phone": `${params.faker.phone}`,
                    "BillingCity": `${params.faker.BillingCity}`,
                    "BillingCountry": `${params.faker.BillingCountry}`,
                    "BillingPostalCode": `${params.faker.BillingPostalCode}`,
                    "BillingState": `${params.faker.BillingState}`,
                    "BillingStreet": `${params.faker.BillingStreet}`,
                    "ShippingCity": `${params.faker.ShippingCity}`,
                    "ShippingCountry": `${params.faker.ShippingCountry}`,
                    "ShippingPostalCode": `${params.faker.ShippingPostalCode}`,
                    "ShippingState": `${params.faker.ShippingState}`,
                    "ShippingStreet": `${params.faker.ShippingStreet}`,
                    "vlocity_cmt__Active__c": "Yes",
                    "ParentId": "@{refAccountBA.id}"
                }
            },
            {
                "method": "POST",
                "url": `/services/data/v${apiVersion}/sobjects/Contact`,
                "referenceId": "refContact",
                "body": {
                    "FirstName": `${params.faker.firstName}`,
                    "LastName": `${params.faker.lastName}`,
                    "Phone": `${params.faker.phone}`,
                    "OtherPhone" : `${params.faker.phone}`,
                    "Email": `${params.faker.vlocity_cmt__BillingEmailAddress__c}`,
                    "MailingCity": `${params.faker.BillingCity}`,
                    "MailingCountry": `${params.faker.BillingCountry}`,
                    "MailingPostalCode": `${params.faker.BillingPostalCode}`,
                    "MailingStreet": `${params.faker.BillingState}`,
                    "AccountId": "@{refAccountSA.id}"
                }
            },
            {
                "method": "POST",
                "url": `/services/data/v${apiVersion}/sobjects/vlocity_cmt__Subscription__c`,
                "referenceId": "refSubscription",
                "body": {
                    "vlocity_cmt__AccountId__c": "@{refAccountCA.id}",
                    "vlocity_cmt__BillingAccountId__c": "@{refAccountBA.id}",
                    "vlocity_cmt__ServiceAccountId__c": "@{refAccountSA.id}",
                    "vlocity_cmt__ServiceIdentifier__c": `${params.faker.vlocity_cmt__ServiceIdentifier__c}`,
                    "vlocity_cmt__SubscriptionNumber__c": `${params.faker.vlocity_cmt__SubscriptionNumber__c}`,
                    "vlocity_cmt__Status__c": "Active",
                    "vlocity_cmt__StartDate__c": `${params.startDate}`,
                    "vlocity_cmt__EndDate__c": ""
                }
            }
        ],
        "allOrNone": true
    };
    return requestStr;
}

const getCreateOrderRequest = (params) => {
    var today = new Date();
    const requestStr = {
        "methodName": "createCart",
        "objectType": "Order",
        "inputFields": [
            {
                "effectivedate": `${today.toLocaleDateString("en-US")}`  // add options later
            },
            {
                "status": "Draft"  // add options later
            },
            {
                "Name": "Headless CPQ Order"  // add options later
            },
            {
                "vlocity_cmt__PriceListId__c": `${params.priceListId}`
            },
            {
                "AccountId": `${params.accId}`
            }
        ],
        "subaction": "createOrder",
        "fields": "Id,Name,EffectiveDate,OrderNumber"
    }
    return requestStr;
}

/*
Add below if necessary

"price" : false,
validate" : false,

*/
const getAddItemsToCartRequest = (params) => {
    const requestStr = {
        "methodName": "postCartsItems",
        "cartId": params.cartId,
        "items": params.itemsArray,
        "noResponseNeeded": true
    }
    return requestStr;
}

const getCustomerInteractionReq = (params) => {
    const requestStr = {
        "compositeRequest": [
            {
                "method": "POST",
                "url": `/services/data/v${apiVersion}/sobjects/vlocity_cmt__CustomerInteraction__c`,
                "referenceId": "refCustInteraction",
                "body": {
                    "Name": `Int for ${params.fullName}`,
                    "vlocity_cmt__Channel__c" : "Agent",
                    "vlocity_cmt__Comments__c" : "Sample comment, this record was created automatically.",
                    "vlocity_cmt__AccountId__c": `${params.recordTypeSA}`,
                    "vlocity_cmt__ContactId__c": "Active",
                    "vlocity_cmt__Status__c": `Completed`, // add options later
                    "vlocity_cmt__Type__c": `Call`, // add options later
                    "vlocity_cmt__Verified__c": true
                }
            },
        ]
    };
    return requestStr;
}

// Export the getActionByName function
export { getAccountCompositeRequest, getCreateOrderRequest, getAddItemsToCartRequest, getCustomerInteractionReq };