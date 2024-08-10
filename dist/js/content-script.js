/*global chrome*/
let sfHostStr;
// Wait for the page to fully load
window.addEventListener('load', function () {
  // Send a message to the background script
  chrome.runtime.sendMessage({ message: "getSfHost", url: location.href }, sfHost => {
    if (sfHost) {
      // console.log('sf host --> ' + sfHost);
      //alert('sf host active');
      sfHostStr = sfHost;
    }
  });

  // Fix Integration Procedure Execute Button
  if (window.location.href.includes('integrationproceduredesigner')) {
    var element = document.querySelector('button.slds-button.slds-button--brand.slds-col_bump-left');
    if (element) {
      element.style.position = 'fixed';
      element.style.top = '1rem';
      element.style.right = '2rem';
    }
  }
  // Find the existing <ul> element in Salesforce
  // Create a new button element inside the <li>
  var button = document.createElement('button');
  button.id = 'sfHelperBtn';
  button.innerText = 'OS Helper';
  // Set inline styles for the button
  button.style.position = 'relative';
  button.style.color = '#fff';
  button.style.borderRadius = '1rem';
  button.style.backgroundImage = 'linear-gradient(90deg, #0065ff, #6942ef, #6554c0, #008cff, #0065ff, #6942ef)';
  button.style.backgroundSize = '400%';
  button.style.backgroundPosition = '0% 0%';
  button.style.border = 'none';
  button.style.padding = '4px 10px';

  /// Define CSS animation keyframes
  var animationKeyframes = `
@keyframes gradientRotate {
    0% {
        background-position: 0% 0%;
    }
    100% {
        background-position: 100% 100%;
    }
}
`;

  // Create a style element for animation keyframes
  var animationStyle = document.createElement('style');
  animationStyle.innerHTML = animationKeyframes;

  // Add animation keyframes to the document head
  document.head.appendChild(animationStyle);

  // Apply hover animation
  button.addEventListener('mouseenter', function () {
    button.style.animation = 'gradientRotate 2s infinite';
  });

  // Remove hover animation when mouse leaves
  button.addEventListener('mouseleave', function () {
    button.style.animation = 'none';
  });
  // Create the SVG element for the icon
  var svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('class', 'slds-m-left_xx-small');
  svgIcon.setAttribute('aria-hidden', 'true');
  svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgIcon.setAttribute('viewBox', '0 0 24 24'); // Adjust the viewBox as needed to fit your icon
  svgIcon.setAttribute('width', '20');
  svgIcon.setAttribute('height', '20');
  // Create the path element for the icon shape
  var pathIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathIcon.setAttribute('d', 'M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z'); // Example path data, replace it with your own SVG path data
  pathIcon.setAttribute('fill', '#fff'); // Set the fill color
  // Append the path element to the SVG element
  svgIcon.appendChild(pathIcon);
  // Append the SVG icon and the span to the button
  button.appendChild(svgIcon);
  // Add an event listener to the button
  button.addEventListener('click', function () {
    sendMessageOpenTab();
  });
  //Assing Button 
  //Check Top Right Side Global Icons
  var globalActionUL = document.getElementsByClassName("slds-global-actions")[0];
  if (globalActionUL) {
    initButton(globalActionUL, button);
  }
  // if class not found then wait for 3 seconds, let dom load and then init
  else {
    getGlobalActionUL(button);
  }
});

function getGlobalActionUL(button) {
  setTimeout(() => {
    var globalActionUL = document.getElementsByClassName("slds-global-actions")[0];
    // console.log('setTimeout globalActionUL --> ' + globalActionUL);
    initButton(globalActionUL, button);
  }, 3000); // Add delay for DOM loading
}

const initButton = (globalActionUL, button) => {
  // if its classic
  if (!globalActionUL) {
    const navLinks = document.querySelector('.navLinks .linkElements');
    if (navLinks) {
      navLinks.appendChild(button);
    }
  }
  //if its lightning
  else {
    var newLi = document.createElement('li');
    newLi.className = 'slds-global-actions__item slds-grid';
    newLi.appendChild(button);
    globalActionUL.insertAdjacentElement('afterbegin', newLi);
  }

}

const sendMessageOpenTab = () => {
  let msgOptions = {
    host: sfHostStr
  }
  chrome.runtime.sendMessage({ message: "openAppTab", url: location.href, options: msgOptions }, item => {
    if (item) {
      // console.log('success');
    }
  });
}

