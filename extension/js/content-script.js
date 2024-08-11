/*global chrome*/
let sfHostStr;

// Listen for button events
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handle the "Find" button
  if (request.msg == "addEventNameHere") {
    // do nothing
  }
});


window.addEventListener('load', function () {
  // Send a message to the background script
  chrome.runtime.sendMessage({ message: "getSfHost", url: location.href }, sfHost => {
    if (sfHost) {
      sfHostStr = sfHost;
    }
  });

  // Create the button and attach it to the DOM
  injectStyles();
  const button = createButton();
  attachButton(button);
});

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .slds-grid--frame {
      min-width: auto !important;
      max-width: 100% !important;
      overflow: auto !important;
      min-height: 100vh !important;
    }
    @keyframes gradientRotate {
      0% { background-position: 0% 0%; }
      100% { background-position: 100% 100%; }
    }
  `;
  document.head.appendChild(style);
}

function createButton() {
  const button = document.createElement('button');
  button.id = 'sfHelperBtn';
  button.innerText = 'CPQ Data Gen';
  Object.assign(button.style, {
    position: 'relative',
    color: '#fff',
    borderRadius: '1rem',
    backgroundImage: 'linear-gradient(-225deg, rgb(158, 0, 82) 0%, rgb(255, 255, 255) 56%, rgb(219, 13, 120) 100%)',
    backgroundSize: '400%',
    backgroundPosition: '0% 0%',
    border: 'none',
    padding: '4px 10px'
  });

  button.addEventListener('mouseenter', () => {
    button.style.animation = 'gradientRotate 2s infinite';
  });

  button.addEventListener('mouseleave', () => {
    button.style.animation = 'none';
  });

  const svgIcon = createSVGIcon();
  button.appendChild(svgIcon);
  button.addEventListener('click', sendMessageOpenTab);

  return button;
}

function createSVGIcon() {
  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('class', 'slds-m-left_xx-small');
  svgIcon.setAttribute('aria-hidden', 'true');
  svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgIcon.setAttribute('viewBox', '0 0 24 24');
  svgIcon.setAttribute('width', '20');
  svgIcon.setAttribute('height', '20');

  const pathIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathIcon.setAttribute('d', 'M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z');
  pathIcon.setAttribute('fill', '#fff');

  svgIcon.appendChild(pathIcon);

  return svgIcon;
}

function attachButton(button) {
  const globalActionUL = document.querySelector(".slds-global-actions");
  if (globalActionUL) {
    initButton(globalActionUL, button);
  } else {
    setTimeout(() => {
      const delayedGlobalActionUL = document.querySelector(".slds-global-actions");
      initButton(delayedGlobalActionUL, button);
    }, 3000);
  }
}

function initButton(globalActionUL, button) {
  if (!globalActionUL) {
    const navLinks = document.querySelector('.navLinks .linkElements');
    if (navLinks) {
      navLinks.appendChild(button);
    }
  } else {
    const newLi = document.createElement('li');
    newLi.className = 'slds-global-actions__item slds-grid';
    newLi.appendChild(button);
    globalActionUL.insertAdjacentElement('afterbegin', newLi);
  }
}

function sendMessageOpenTab() {
  chrome.runtime.sendMessage({ message: "openAppTab", url: location.href, options: { host: sfHostStr } }, item => {
    if (item) {
      //console.log('Tab opened successfully');
    }
  });
}