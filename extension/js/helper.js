/*global chrome*/

const sendMessageOpenTab = (sfHostStr) => {
    let msgOptions = {
      host: sfHostStr
    }
    chrome.runtime.sendMessage({ message: "openAppTab", url: location.href, options: msgOptions }, item => {
      if (item) {
        console.log('success');
      }
    });
  }