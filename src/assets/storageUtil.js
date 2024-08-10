/* global chrome */

let recordListArr = [];

// Save Data to Chrome
export function saveToChrome(itemList) {
  chrome.storage.local.set({ recordList: itemList }, () => {
    console.log('helper method data saved successfully');
  });
}

export const saveRecord = async (newData, domain) => {
    const existingRecords = await new Promise((resolve, reject) => {
      chrome.storage.local.get({ [domain]: [] }, (result) => {
        const existingRecords = result[domain];
        resolve(existingRecords);
      });
    });
  
    // Check if the item already exists in any category
    const itemExists = existingRecords.some(record =>
      record.items.some(item => item.id === newData.id)
    );
  
    if (!itemExists) {
      // Find the existing type category
      let typeCategory = existingRecords.find(record => record.type === newData.type);
  
      if (typeCategory) {
        // Add the new item to the existing type category
        typeCategory.items.push({ id: newData.id, name: newData.name });
      } else {
        // Create a new type category with the new item
        typeCategory = {
          type: newData.type,
          items: [{ id: newData.id, name: newData.name }]
        };
        existingRecords.push(typeCategory);
      }
  
      // Update the storage with the new records for the specified domain
      chrome.storage.local.set({ [domain]: existingRecords }, () => {
        console.log('Record list updated for domain:', domain);
      });
      return true;
    } else {
      console.log('Item already exists:', newData);
      return false;
    }
  };
  
  

// Update Record
export async function updateRecord(id, newData) {
  const existingRecords = await new Promise((resolve) => {
    chrome.storage.local.get('recordList', (result) => {
      resolve(result.recordList || []);
    });
  });

  const updatedRecords = existingRecords.map((item) =>
    item.id === id ? { ...item, ...newData } : item
  );

  saveToChrome(updatedRecords);
}

// Fetch Record List
export function fetchRecordList() {
  chrome.storage.local.get('recordList', (result) => {
    if (!result.recordList) {
      chrome.storage.local.set({ recordList: [] });
      recordListArr = [];
    } else {
      recordListArr = result.recordList;
      console.log('helper arr result --> ' + JSON.stringify(recordListArr));
    }
  });
  return recordListArr;
}

// Fetch Item Data
export function fetchItemData(index) {
  const recArray = fetchRecordList();
  console.log('recArray --> ' + JSON.stringify(recArray));
  return recArray.find((item) => item.id === index) || null;
}

export const fetchRecords = async (domain) => {
  // console.log('domain --> '+domain);
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ [domain]: [] }, (result) => {
        const records = result[domain];
        resolve(records);
      });
    });
  };
  

// Delete Record
export const deleteRecord = async (id, domain) => {
  const existingRecords = await new Promise((resolve, reject) => {
      chrome.storage.local.get({ [domain]: [] }, (result) => {
          const existingRecords = result[domain];
          resolve(existingRecords);
      });
  });

  // Find the index of the item with the specified ID
  const itemIndex = existingRecords.findIndex(record =>
      record.items.some(item => item.id === id)
  );

  if (itemIndex !== -1) {
      // Remove the item from the items array
      existingRecords[itemIndex].items = existingRecords[itemIndex].items.filter(item => item.id !== id);

      // Update the storage with the modified records
      chrome.storage.local.set({ [domain]: existingRecords }, () => {
          console.log('Record with ID', id, 'deleted for domain:', domain);
      });
      return true;
  } else {
      console.log('Item with ID', id, 'not found for domain:', domain);
      return false;
  }
};
