document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveButton");
    const deleteButton = document.getElementById("deleteButton")
    const deleteAllButton = document.getElementById("deleteAllButton")
    const openUrlButton = document.getElementById("openUrlButton")
    const urlList = document.getElementById("urlList");

    chrome.storage.local.get(["savedUrls"], function (result) {
        const savedUrls = result.savedUrls || [];
        renderUrls(savedUrls);
    });

    chrome.tabs.onActivated.addListener(function (activeInfo) {
        chrome.tabs.get(activeInfo.tabId, function(tab) {
            chrome.storage.local.get("savedUrls", function (result) {
                const savedUrls = result.savedUrls || [];
                renderUrls(savedUrls);
            });
        });
    });

    saveButton.addEventListener("click", function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            console.log("!@!!@!!@!@!@")
            const url = tabs[0].url;
            const name = prompt("Enter url name")

            chrome.storage.local.get(["savedUrls"], function (result) {
                const savedUrls = result.savedUrls || [];
                savedUrls.push({name: name, url: url});

                chrome.storage.local.set({savedUrls: savedUrls}, function (){
                    renderUrls(savedUrls);
                });
            });
        });
    });

    deleteButton.addEventListener("click", function () {
        const selectedUrlIndex = urlList.selectedIndex;
        if (selectedUrlIndex !== -1) {
            chrome.storage.local.get(["savedUrls"], function (result) {
                const savedUrls = result.savedUrls || [];
                savedUrls.splice(selectedUrlIndex, 1)
                chrome.storage.local.set({savedUrls: savedUrls}, function () {
                    renderUrls(savedUrls)
                });
            });
        }
    });

    deleteAllButton.addEventListener("click", function () {
        chrome.storage.local.set({savedUrls: []}, function (){
            renderUrls()
        });
    });

    openUrlButton.addEventListener("click", function (){
        const currentUrl = urlList.selectedIndex;
        chrome.storage.local.get(["savedUrls"], function (result) {
            chrome.tabs.create({url: result.savedUrls[currentUrl].url})
        });
    });

    toArchive.addEventListener("click", function () {
        chrome.storage.local.get(["savedUrls", "archives"], function (result) {
            const savedUrls = result.savedUrls || [];
            const archives = result.archives || [];
            const nameArchive = prompt("Name for archive");
            const savedArchive = { name: nameArchive, archive: savedUrls };
            archives.push(savedArchive);
            chrome.storage.local.set({ archives: archives }, function () {
            });
            chrome.storage.local.set({ savedUrls: [] }, function () {
                renderUrls();
            });
        });
    });

    function renderUrls(urls) {
        urlList.innerHTML = "";
        if (urls) {
            urls.forEach(function (item) {
                const option = document.createElement("option");
                option.text = item.name;
                urlList.add(option);
            });
        }
    }
});
