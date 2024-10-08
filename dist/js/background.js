/*global chrome*/
let sessionCookieData;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "getSfHost") {
    chrome.cookies.get({ url: request.url, name: "sid", storeId: sender.tab.cookieStoreId }, cookie => {
      if (!cookie) {
        sendResponse(null);
        return;
      }
      let [orgId] = cookie.value.split("!");
      chrome.cookies.getAll({ name: "sid", domain: "salesforce.com", secure: true, storeId: sender.tab.cookieStoreId }, cookies => {
        let sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
        if (sessionCookie) {
          sendResponse(sessionCookie.domain);
        } else {
          chrome.cookies.getAll({ name: "sid", domain: "cloudforce.com", secure: true, storeId: sender.tab.cookieStoreId }, cookies => {
            sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
            if (sessionCookie) {
              sendResponse(sessionCookie.domain);
            } else {
              sendResponse(null);
            }
          });
        }
      });
    });
    return true; // Tell Chrome that we want to call sendResponse asynchronously.
  }
  if (request.message == "getSession") {
    chrome.cookies.get({ url: "https://" + request.sfHost, name: "sid", storeId: sender.tab.cookieStoreId }, sessionCookie => {
      if (!sessionCookie) {
        sendResponse(null);
        return;
      }
      let session = { key: sessionCookie.value, hostname: sessionCookie.domain };
      sessionCookieData = { key: sessionCookie.value, hostname: sessionCookie.domain };
      sendResponse(session);
    });
    return true; // Tell Chrome that we want to call sendResponse asynchronously.
  }
  return false;
});

// Open New Tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "openAppTab") {
    const { options } = request;
    let host = options.host;
    chrome.tabs.create({
      url: `${chrome.runtime.getURL('app.html')}?host=${host}`,
    });
    return true;
  }
  return true;
});