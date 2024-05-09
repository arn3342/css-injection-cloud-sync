function initializeContentScript() {

     function applyChanges(tabId, hostname) {

          chrome.storage.sync.get(hostname, function (data) {

               let domainData = data[hostname];  // Use the provided hostname here

               if (domainData) {

                    // Inject CSS
                    if (domainData.css) {
                         let style = document.createElement('style');
                         style.textContent = domainData.css.replace(/;/g, " !important;");
                         document.head.appendChild(style);
                    }

                    // Inject JavaScript
                    if (domainData?.js) {

                         // chrome.scripting.executeScript({
                         //      target: { tabId: tabId },
                         //      func: () => {
                         //           console.log("Inside Scripting");
                         //      }
                         // }).then(() => console.log("injected a function"));

                         // const script = document.createElement('script');
                         // script.textContent = domainData.js;
                         // (document.head || document.documentElement).appendChild(script);
                         // script.remove();

                    }
               }
          });
     }

     chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
          if (request.action === "applyChanges") {
               applyChanges(request.tabId, request.hostname);
          }
     });

     // If this is a content script, the tabId isn't needed for the chrome.scripting.executeScript method.
     applyChanges(null, window.location.hostname);
}

// Add an event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeContentScript);
