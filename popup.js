
document.addEventListener("DOMContentLoaded", function () {

     // chrome.storage.sync.get(null, function (items) {
     //      console.log(items);
     // });

     let data = {}

     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          let domain = new URL(tabs[0].url).hostname;
          const tabId = tabs[0].id;
          document.getElementById("domain").textContent = domain;

          var cssEditor = CodeMirror(document.getElementById("customCSS"), {
               mode: "css",
               lineNumbers: true,
               theme: "default",
               autoCloseBrackets: true,
               smartIndent: true, // Auto-indentation
               extraKeys: {
                    "Ctrl-Space": "autocomplete", // Autocomplete on Ctrl-Space
                    "Ctrl-/": "toggleComment" // Toggle comment on Ctrl-/
               }
          });

          var jsEditor = CodeMirror(document.getElementById("customJS"), {
               mode: "javascript",
               lineNumbers: true,
               theme: "default",
               autoCloseBrackets: true,
               smartIndent: true, // Auto-indentation
               extraKeys: {
                    "Ctrl-Space": "autocomplete", // Autocomplete on Ctrl-Space
                    "Ctrl-/": "toggleComment" // Toggle comment on Ctrl-/
               }
          });


          // Save buttons
          document.getElementById("save").addEventListener("click", function () {

               let customCSS = cssEditor.getValue();
               let customJS = jsEditor.getValue();

               data[domain] = { css: customCSS, js: customJS };
               console.log(data);

               chrome.storage.sync.set(data, function () {

                    console.log(tabId);

                    chrome.tabs.sendMessage(tabId, { action: "applyChanges", hostname: domain, tabId: tabId, data: data[domain] });

                    // Save into Cloud (if you have this functionality)
               });
          });

          document.getElementById('close').addEventListener('click', function () {
               window.close();
          });


          // Fill CSS / JS
          chrome.storage.sync.get(domain, function (data) {
               let domainData = data[domain];
               if (domainData) {
                    if (domainData.css) {
                         cssEditor.setValue(domainData.css);
                    }
                    if (domainData.js) {
                         jsEditor.setValue(domainData.js);
                    }
               }
          });


     });


});
