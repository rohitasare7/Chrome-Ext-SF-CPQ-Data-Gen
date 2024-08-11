import { apiVersion } from "./helper";
const actionList = [
    /*
    * Important Queries
    */
    {
        name: 'Query_GetCatalogCode',
        uri: `/services/data/v${apiVersion}/query/?q=SELECT Id, vlocity_cmt__CatalogCode__c FROM vlocity_cmt__Catalog__c`,
        method: 'GET',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'Query_AccountRecordType',
        uri: `/services/data/v${apiVersion}/query/?q=select Id,Name from RecordType where sObjectType='Account' AND Name IN ('Service','Billing','Consumer')`,
        method: 'GET',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'Query_PriceList',
        uri: `/services/data/v${apiVersion}/query/?q=SELECT Id,Name FROM vlocity_cmt__PriceList__c WHERE vlocity_cmt__IsActive__c = TRUE`,
        method: 'GET',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'Query_PriceBookEntryList',
        uri: `/services/data/v${apiVersion}/query/?q=SELECT Id,Name,Pricebook2.Name,Product2.Name,Product2.ProductCode, Product2.vlocity_cmt__Type__c, Product2.vlocity_cmt__SubType__c,Product2.Family FROM PricebookEntry WHERE Product2.vlocity_cmt__IsOrderable__c = True AND IsActive = True ORDER BY Name, Pricebook2.Name DESC`,
        method: 'GET',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'EPC_GetOffersByCatalogCode',
        uri: `/services/apexrest/vlocity_cmt/v3/catalogs/<RecordId>/offers`,
        method: 'GET',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'CRUD_CompositeAPI',
        uri: `/services/data/v${apiVersion}/composite/`,
        method: 'POST',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'CPQ_CreateCart',
        uri: `/services/apexrest/vlocity_cmt/v2/carts`,
        method: 'POST',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'CPQ_AddItemsToCart',
        uri: `/services/apexrest/vlocity_cmt/v2/cpq/carts/<RecordId>/items`,
        method: 'POST',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'CPQ_CheckoutOrder',
        uri: `/services/apexrest/vlocity_cmt/v2/cpq/carts/<RecordId>/items/checkout`,
        method: 'POST',
        contentType: 'application/json',
        responeType: 'json',
    },
    {
        name: 'CRUD_CompositeSobjects',
        uri: `/services/data/v${apiVersion}/composite/sobjects`,
        method: 'PATCH',
        contentType: 'application/json',
        responeType: 'json',
    },
    /*
    Add logic to check pricebook + pricelist to filter products
    */
    // query?q=SELECT Id,Name, CreatedBy.Name, LastModifiedBy.Name, LastModifiedDate, Body from ApexClass where Id IN ({$apexClassIdList});
];

// function to get the action data by name
const getActionByName = (name) => {
    const action = actionList.find((action) => action.name == name);
    return action || null;
}


// Export the getActionByName function
export { getActionByName };